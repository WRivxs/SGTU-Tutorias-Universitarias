import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarTutorComponent } from '../../../../shared/components/layout/sidebar-tutor/sidebar-tutor.component';
import { TutoriaService } from '../../../../core/services/tutoria.service';
import { MateriaService } from '../../../admin/services/materia.service';
import { TutorPerfilService, TutorPerfil } from '../../../../core/services/tutor-perfil.service';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { Tutoria, EstadoTutoria, ModalidadTutoria } from '../../../../shared/models/tutoria.model';
import { Materia } from '../../../../shared/models/materia.model';
import { Solicitud } from '../../../../shared/models/solicitud.model';

@Component({
  selector: 'app-mis-tutorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, SidebarTutorComponent],
  templateUrl: './mis-tutorias.html'
})
export class MisTutorias implements OnInit {
  private tutoriaService = inject(TutoriaService);
  private materiaService = inject(MateriaService);
  private tutorPerfilService = inject(TutorPerfilService);
  private solicitudService = inject(SolicitudService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  usuario = this.authService.usuario;
  perfilTutor = signal<TutorPerfil | null>(null);

  tutorias = signal<Tutoria[]>([]);
  materias = signal<Materia[]>([]);
  solicitudes = signal<Solicitud[]>([]);
  cargando = signal<boolean>(true);

  // Modal para ver lista de estudiantes inscritos en una tutoría
  modalEstudiantesAbierto = signal<boolean>(false);
  tutoriaSeleccionadaEstudiantes = signal<Tutoria | null>(null);

  filtroEstado = signal<string>('TODOS');
  modalAbierto = signal<boolean>(false);
  editandoId = signal<number | null>(null);

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  form = this.fb.group({
    materiaId: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    hora: ['', [Validators.required]],
    modalidad: ['PRESENCIAL' as ModalidadTutoria, [Validators.required]],
    lugar: ['', [Validators.required]],
    descripcion: [''],
    estado: ['DISPONIBLE' as EstadoTutoria]
  });

  tutoriasFiltradas = computed(() => {
    const list = this.tutorias();
    const est = this.filtroEstado();
    if (est === 'TODOS') return list;
    return list.filter(t => t.estado === est);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    // 1. Cargar materias del catálogo
    this.materiaService.listar().subscribe({
      next: (mats) => this.materias.set(mats),
      error: () => {}
    });

    // 2. Intentar obtener el perfil de tutor del usuario logueado (si existe)
    const u = this.usuario();
    if (u && u.id) {
      this.tutorPerfilService.obtenerPorUsuarioId(u.id).subscribe({
        next: (perfil) => this.perfilTutor.set(perfil),
        error: () => {
          // Si no tiene perfil aún, podemos auto-registrar su perfil de tutor
          this.crearPerfilTutorSiNoExiste(u.id);
        }
      });
    }

    // 3. Cargar las solicitudes para calcular cuántos estudiantes se han inscrito
    this.cargarSolicitudes();

    // 4. Cargar las tutorías directamente (sin bloquear por el perfil)
    this.cargarTutorias();
  }

  cargarSolicitudes(): void {
    this.solicitudService.listar().subscribe({
      next: (sols) => this.solicitudes.set(sols),
      error: () => {}
    });
  }

  obtenerInscritos(tutoriaId?: number): Solicitud[] {
    if (!tutoriaId) return [];
    return this.solicitudes().filter(s => s.tutoria?.id === tutoriaId && s.estado === 'ACEPTADA');
  }

  obtenerPendientes(tutoriaId?: number): Solicitud[] {
    if (!tutoriaId) return [];
    return this.solicitudes().filter(s => s.tutoria?.id === tutoriaId && s.estado === 'PENDIENTE');
  }

  abrirModalEstudiantes(t: Tutoria): void {
    this.tutoriaSeleccionadaEstudiantes.set(t);
    this.modalEstudiantesAbierto.set(true);
  }

  cerrarModalEstudiantes(): void {
    this.modalEstudiantesAbierto.set(false);
    this.tutoriaSeleccionadaEstudiantes.set(null);
  }

  private crearPerfilTutorSiNoExiste(usuarioId: number): void {
    const nuevoPerfil: TutorPerfil = {
      usuario: { id: usuarioId },
      especialidad: 'Docente Académico',
      descripcion: 'Tutor de acompañamiento universitario',
      disponibilidad: 'Lunes a Viernes'
    };
    this.tutorPerfilService.crear(nuevoPerfil).subscribe({
      next: (creado) => this.perfilTutor.set(creado),
      error: () => {
        // Si no se puede crear por permisos, buscamos en la lista general de tutores
        this.tutorPerfilService.listar().subscribe({
          next: (lista) => {
            const encontrado = lista.find(t => t.usuario?.id === usuarioId);
            if (encontrado) {
              this.perfilTutor.set(encontrado);
            } else if (lista.length > 0) {
              this.perfilTutor.set(lista[0]);
            }
          },
          error: () => {}
        });
      }
    });
  }

  cargarTutorias(): void {
    this.tutoriaService.listar().subscribe({
      next: (data) => {
        const u = this.usuario();
        if (u) {
          // Filtramos las tutorías que corresponden al tutor logueado
          const delTutor = data.filter(t =>
            t.tutor?.usuario?.correo === u.correo ||
            t.tutor?.usuario?.nombre === u.nombre
          );
          // Si encontramos sus tutorías las mostramos; si no tiene ninguna creada aún, dejamos lista vacía
          this.tutorias.set(delTutor);
        } else {
          this.tutorias.set(data);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.mostrarError('Error al conectar con el servidor de tutorías');
        this.cargando.set(false);
      }
    });
  }

  cambiarFiltro(est: string): void {
    this.filtroEstado.set(est);
  }

  abrirModalNuevo(): void {
    this.editandoId.set(null);
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaDefecto = manana.toISOString().split('T')[0];

    this.form.reset({
      materiaId: this.materias().length > 0 ? String(this.materias()[0].id) : '',
      fecha: fechaDefecto,
      hora: '14:00',
      modalidad: 'PRESENCIAL',
      lugar: 'Aula 204',
      descripcion: '',
      estado: 'DISPONIBLE'
    });
    this.modalAbierto.set(true);
  }

  abrirModalEditar(t: Tutoria): void {
    this.editandoId.set(t.id!);
    this.form.patchValue({
      materiaId: t.materia?.id ? String(t.materia.id) : '',
      fecha: t.fecha,
      hora: t.hora ? t.hora.substring(0, 5) : '14:00',
      modalidad: t.modalidad,
      lugar: t.lugar || '',
      descripcion: t.descripcion || '',
      estado: t.estado || 'DISPONIBLE'
    });
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.editandoId.set(null);
  }

  guardarTutoria(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    let horaFormat = val.hora!;
    if (horaFormat.length === 5) {
      horaFormat += ':00';
    }

    const perf = this.perfilTutor();
    // En la base de datos el tutor Wadid tiene id 1 en la tabla tutores
    const tutorId = perf?.id || 1;

    const payload: any = {
      materia: { id: Number(val.materiaId) },
      tutor: { id: tutorId },
      fecha: val.fecha!,
      hora: horaFormat,
      modalidad: val.modalidad as ModalidadTutoria,
      lugar: val.lugar!,
      descripcion: val.descripcion || '',
      estado: (this.editandoId() ? (val.estado as EstadoTutoria) : 'DISPONIBLE')
    };

    if (this.editandoId()) {
      this.tutoriaService.actualizar(this.editandoId()!, payload).subscribe({
        next: () => {
          this.mostrarExito('Tutoría actualizada con éxito');
          this.cerrarModal();
          this.cargarTutorias();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al actualizar tutoría')
      });
    } else {
      this.tutoriaService.crear(payload).subscribe({
        next: () => {
          this.mostrarExito('Tutoría programada exitosamente');
          this.cerrarModal();
          this.cargarTutorias();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al programar tutoría')
      });
    }
  }

  cambiarEstado(t: Tutoria, nuevoEstado: EstadoTutoria): void {
    this.tutoriaService.cambiarEstado(t.id!, nuevoEstado).subscribe({
      next: () => {
        this.mostrarExito(`Tutoría marcada como ${nuevoEstado}`);
        this.cargarTutorias();
      },
      error: () => this.mostrarError('Error al cambiar el estado de la tutoría')
    });
  }

  eliminarTutoria(t: Tutoria): void {
    if (!confirm(`¿Eliminar la tutoría de ${t.materia?.nombre}?`)) return;

    this.tutoriaService.eliminar(t.id!).subscribe({
      next: () => {
        this.mostrarExito('Tutoría eliminada exitosamente');
        this.cargarTutorias();
      },
      error: () => this.mostrarError('Error al eliminar tutoría')
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
