import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarEstudianteComponent } from '../../../../shared/components/layout/sidebar-estudiante/sidebar-estudiante.component';
import { TutoriaService } from '../../../../core/services/tutoria.service';
import { MateriaService } from '../../../admin/services/materia.service';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Tutoria } from '../../../../shared/models/tutoria.model';
import { Materia } from '../../../../shared/models/materia.model';
import { Solicitud } from '../../../../shared/models/solicitud.model';
import { Estudiante } from '../../../../shared/models/estudiante.model';

@Component({
  selector: 'app-buscar-tutorias',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarEstudianteComponent],
  templateUrl: './buscar-tutorias.html'
})
export class BuscarTutorias implements OnInit {
  private tutoriaService = inject(TutoriaService);
  private materiaService = inject(MateriaService);
  private estudianteService = inject(EstudianteService);
  private solicitudService = inject(SolicitudService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  usuario = this.authService.usuario;

  // Perfil académico del estudiante cargado desde la BD relacional (Fase 4 - Corrección del docente)
  perfilEstudiante = signal<Estudiante | null>(null);

  tutorias = signal<Tutoria[]>([]);
  materias = signal<Materia[]>([]);
  misSolicitudes = signal<Solicitud[]>([]);
  todasSolicitudes = signal<Solicitud[]>([]);
  cargando = signal<boolean>(true);
  enviando = signal<boolean>(false);

  // Filtros dinámicos requeridos por el profesor
  busqueda = signal<string>('');
  filtroSemestre = signal<string>('TODOS'); // Semestres 1 a 10 o TODOS
  filtroMateria = signal<string>('TODAS');
  filtroModalidad = signal<string>('TODAS');

  // Modal para solicitar
  modalSolicitudAbierto = signal<boolean>(false);
  tutoriaSeleccionada = signal<Tutoria | null>(null);
  comentarioSolicitud = signal<string>('');

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.filtroSemestre.set('TODOS');
    this.filtroMateria.set('TODAS');
    this.filtroModalidad.set('TODAS');
  }

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  // Lista reactiva de tutorías filtradas
  tutoriasFiltradas = computed(() => {
    let list = this.tutorias();
    const q = this.busqueda().toLowerCase().trim();
    const sem = this.filtroSemestre();
    const matId = this.filtroMateria();
    const mod = this.filtroModalidad();

    // 1. Filtro por búsqueda textual (materia, docente, descripción)
    if (q) {
      list = list.filter(t => {
        const nombreMat = t.materia?.nombre?.toLowerCase() || '';
        const codigoMat = t.materia?.codigo?.toLowerCase() || '';
        const nombreDoc = (t.docente?.usuario?.nombre || t.tutor?.usuario?.nombre || '').toLowerCase();
        const apellidoDoc = (t.docente?.usuario?.apellido || t.tutor?.usuario?.apellido || '').toLowerCase();
        const desc = t.descripcion?.toLowerCase() || '';
        return nombreMat.includes(q) || codigoMat.includes(q) || nombreDoc.includes(q) || apellidoDoc.includes(q) || desc.includes(q);
      });
    }

    // 2. Filtro por Semestre de la Malla (1° a 10°) - Corrección Profesor
    if (sem !== 'TODOS') {
      const semestreNum = Number(sem);
      list = list.filter(t => t.materia?.semestre === semestreNum);
    }

    // 3. Filtro por Asignatura específica
    if (matId !== 'TODAS') {
      const idNum = Number(matId);
      list = list.filter(t => t.materia?.id === idNum);
    }

    // 4. Filtro por Modalidad (PRESENCIAL / VIRTUAL)
    if (mod !== 'TODAS') {
      list = list.filter(t => t.modalidad === mod);
    }

    return list;
  });

  // Materias filtradas por el programa del estudiante para el combo de materias
  materiasDelPrograma = computed(() => {
    const perfil = this.perfilEstudiante();
    const todas = this.materias();
    const programaId = perfil?.programa?.id;
    if (!programaId) return todas;
    return todas.filter(m => m.programa?.id === programaId);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    const u = this.usuario();

    // 1. Cargar Perfil de Estudiante para identificar su Programa y Semestre
    if (u && u.id) {
      this.estudianteService.obtenerPorUsuarioId(u.id).subscribe({
        next: (estudiante) => {
          this.perfilEstudiante.set(estudiante);
          this.cargarCatalogoTutorias(estudiante.programa?.id);
        },
        error: () => {
          // Si no tiene perfil aún, cargar tutorías globales
          this.cargarCatalogoTutorias();
        }
      });

      // Cargar solicitudes de este estudiante
      this.solicitudService.listar(u.id).subscribe({
        next: (sols) => this.misSolicitudes.set(sols),
        error: () => {}
      });
    } else {
      this.cargarCatalogoTutorias();
    }

    // Cargar materias generales
    this.materiaService.listar().subscribe({
      next: (mats) => this.materias.set(mats),
      error: () => {}
    });

    // Cargar todas las solicitudes para el cómputo de cupos ocupados
    this.solicitudService.listar().subscribe({
      next: (sols) => this.todasSolicitudes.set(sols),
      error: () => {}
    });
  }

  // Carga el catálogo prefiltrado por el programa del estudiante (Corrección del profesor)
  cargarCatalogoTutorias(programaId?: number): void {
    const filtros: any = {};
    if (programaId) {
      filtros.programaId = programaId;
    }

    this.tutoriaService.listar(filtros).subscribe({
      next: (data) => {
        const visibles = data.filter(t => t.estado === 'DISPONIBLE' || t.estado === 'OCUPADA');
        this.tutorias.set(visibles);
        this.cargando.set(false);
      },
      error: () => {
        // Fallback a listar sin filtros si el backend da error
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
    });
  }

  contarInscritos(tutoriaId?: number): number {
    if (!tutoriaId) return 0;
    return this.todasSolicitudes().filter(s => s.tutoria?.id === tutoriaId && s.estado === 'ACEPTADA').length;
  }

  obtenerCupoMaximo(t: Tutoria): number {
    return t.cupoMaximo || 5;
  }

  hayCuposDisponibles(t: Tutoria): boolean {
    return this.contarInscritos(t.id) < this.obtenerCupoMaximo(t);
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
    const perfil = this.perfilEstudiante();

    if (!t || !t.id || !u || !u.id) {
      this.mostrarError('Error en la sesión del usuario');
      return;
    }

    if (!this.hayCuposDisponibles(t)) {
      this.mostrarError('Esta tutoría ya alcanzó el cupo máximo permitido.');
      return;
    }

    this.enviando.set(true);

    // Enviar id del perfil de estudiante si existe, o el id de usuario (el backend maneja ambos)
    const estudianteId = perfil?.id ? perfil.id : u.id;

    const payload: any = {
      estudiante: { id: estudianteId },
      tutoria: { id: t.id },
      comentario: this.comentarioSolicitud().trim() || 'Solicitud de acompañamiento en tutoría académica'
    };

    this.solicitudService.crear(payload).subscribe({
      next: () => {
        this.mostrarExito('¡Solicitud enviada exitosamente al docente tutor!');
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
    this.toastService.exito(msg);
    setTimeout(() => this.mensajeExito.set(null), 3500);
  }

  mostrarError(msg: string): void {
    this.mensajeError.set(msg);
    this.toastService.error(msg);
    setTimeout(() => this.mensajeError.set(null), 4000);
  }
}
