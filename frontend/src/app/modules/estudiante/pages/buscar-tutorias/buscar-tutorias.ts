import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarEstudianteComponent } from '../../../../shared/components/layout/sidebar-estudiante/sidebar-estudiante.component';
import { TutoriaService } from '../../../../core/services/tutoria.service';
import { MateriaService } from '../../../admin/services/materia.service';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Tutoria } from '../../../../shared/models/tutoria.model';
import { Materia } from '../../../../shared/models/materia.model';
import { Solicitud } from '../../../../shared/models/solicitud.model';

@Component({
  selector: 'app-buscar-tutorias',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarEstudianteComponent],
  templateUrl: './buscar-tutorias.html'
})
export class BuscarTutorias implements OnInit {
  private tutoriaService = inject(TutoriaService);
  private materiaService = inject(MateriaService);
  private solicitudService = inject(SolicitudService);
  private authService = inject(AuthService);

  usuario = this.authService.usuario;

  tutorias = signal<Tutoria[]>([]);
  materias = signal<Materia[]>([]);
  misSolicitudes = signal<Solicitud[]>([]);
  todasSolicitudes = signal<Solicitud[]>([]);
  cargando = signal<boolean>(true);
  enviando = signal<boolean>(false);

  // Filtros
  busqueda = signal<string>('');
  filtroMateria = signal<string>('TODAS');
  filtroModalidad = signal<string>('TODAS');

  // Modal para solicitar
  modalSolicitudAbierto = signal<boolean>(false);
  tutoriaSeleccionada = signal<Tutoria | null>(null);
  comentarioSolicitud = signal<string>('');

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  tutoriasFiltradas = computed(() => {
    let list = this.tutorias();
    const q = this.busqueda().toLowerCase().trim();

    if (q) {
      list = list.filter(t =>
        (t.materia?.nombre && t.materia.nombre.toLowerCase().includes(q)) ||
        (t.tutor?.usuario?.nombre && t.tutor.usuario.nombre.toLowerCase().includes(q)) ||
        (t.tutor?.usuario?.apellido && t.tutor.usuario.apellido.toLowerCase().includes(q)) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(q))
      );
    }

    if (this.filtroMateria() !== 'TODAS') {
      const matId = Number(this.filtroMateria());
      list = list.filter(t => t.materia?.id === matId);
    }

    if (this.filtroModalidad() !== 'TODAS') {
      list = list.filter(t => t.modalidad === this.filtroModalidad());
    }

    return list;
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    this.materiaService.listar().subscribe({
      next: (mats) => this.materias.set(mats),
      error: () => {}
    });

    const u = this.usuario();
    if (u && u.id) {
      this.solicitudService.listar(u.id).subscribe({
        next: (sols) => this.misSolicitudes.set(sols),
        error: () => {}
      });
    }

    this.solicitudService.listar().subscribe({
      next: (sols) => this.todasSolicitudes.set(sols),
      error: () => {}
    });

    // Listamos las tutorías que estén en estado DISPONIBLE u OCUPADA
    this.tutoriaService.listar().subscribe({
      next: (data) => {
        const visibles = data.filter(t => t.estado === 'DISPONIBLE' || t.estado === 'OCUPADA');
        this.tutorias.set(visibles);
        this.cargando.set(false);
      },
      error: () => {
        this.mostrarError('Error al cargar catálogo de tutorías');
        this.cargando.set(false);
      }
    });
  }

  contarInscritos(tutoriaId?: number): number {
    if (!tutoriaId) return 0;
    return this.todasSolicitudes().filter(s => s.tutoria?.id === tutoriaId && s.estado === 'ACEPTADA').length;
  }

  obtenerEstadoInscripcion(tutoriaId?: number): 'ACEPTADA' | 'PENDIENTE' | 'RECHAZADA' | 'CANCELADA' | null {
    if (!tutoriaId) return null;
    const sol = this.misSolicitudes().find(s => s.tutoria?.id === tutoriaId);
    return sol ? sol.estado : null;
  }

  abrirModalSolicitud(t: Tutoria): void {
    this.tutoriaSeleccionada.set(t);
    this.comentarioSolicitud.set('');
    this.modalSolicitudAbierto.set(true);
  }

  cerrarModalSolicitud(): void {
    this.modalSolicitudAbierto.set(false);
    this.tutoriaSeleccionada.set(null);
    this.comentarioSolicitud.set('');
  }

  confirmarSolicitud(): void {
    const t = this.tutoriaSeleccionada();
    const u = this.usuario();

    if (!t || !t.id || !u || !u.id) {
      this.mostrarError('Error en la sesión del usuario');
      return;
    }

    this.enviando.set(true);

    const payload: any = {
      estudiante: { id: u.id },
      tutoria: { id: t.id },
      comentario: this.comentarioSolicitud().trim() || 'Solicitud de acompañamiento en tutoría grupal'
    };

    this.solicitudService.crear(payload).subscribe({
      next: (creada) => {
        this.mostrarExito('¡Solicitud enviada exitosamente al tutor!');
        this.cerrarModalSolicitud();
        this.cargarDatos();
        this.enviando.set(false);
      },
      error: (err) => {
        this.mostrarError(err.error?.mensaje || 'Ya has enviado una solicitud para esta tutoría o no está disponible');
        this.enviando.set(false);
      }
    });
  }

  mostrarExito(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(null), 3500);
  }

  mostrarError(msg: string): void {
    this.mensajeError.set(msg);
    setTimeout(() => this.mensajeError.set(null), 4000);
  }
}
