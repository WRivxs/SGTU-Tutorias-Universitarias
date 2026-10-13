import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/layout/sidebar/sidebar.component';
import { UsuarioService } from '../../services/usuario.service';
import { TutorPerfilService, TutorPerfil } from '../../../../core/services/tutor-perfil.service';

import { Usuario } from '../../../../shared/models/usuario.model';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './gestion-usuarios.html'
})
export class GestionUsuarios implements OnInit {
  private usuarioService = inject(UsuarioService);
  private tutorPerfilService = inject(TutorPerfilService);
  private fb = inject(FormBuilder);

  usuarios = signal<Usuario[]>([]);
  usuariosFiltrados = signal<Usuario[]>([]);
  tutoresPerfiles = signal<TutorPerfil[]>([]);
  cargando = signal<boolean>(false);
  modalAbierto = signal<boolean>(false);
  editandoId = signal<number | null>(null);
  mostrarPassword = signal<boolean>(false);

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  busqueda = signal<string>('');
  filtroRol = signal<string>('TODOS');
  filtroEstado = signal<string>('TODOS');

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    password: [''],
    rol: ['ESTUDIANTE', [Validators.required]],
    especialidad: [''],
    estado: [true]
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarUsuarios();
    this.cargarPerfilesTutores();
  }

  cargarPerfilesTutores(): void {
    this.tutorPerfilService.listar().subscribe({
      next: (perfiles) => this.tutoresPerfiles.set(perfiles),
      error: () => {}
    });
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuarioService.listar().subscribe({
      next: (data) => {
        const normalizados = data.map(u => ({
          ...u,
          estado: u.estado ?? u.activo ?? true
        }));
        this.usuarios.set(normalizados);
        this.aplicarFiltros();
        this.cargando.set(false);
      },
      error: () => {
        this.mostrarError('Error al cargar la lista de usuarios');
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    let res = this.usuarios();
    const q = this.busqueda().toLowerCase().trim();
    if (q) {
      res = res.filter(u =>
        u.nombre.toLowerCase().includes(q) ||
        u.apellido.toLowerCase().includes(q) ||
        u.correo.toLowerCase().includes(q)
      );
    }
    if (this.filtroRol() !== 'TODOS') {
      res = res.filter(u => u.rol === this.filtroRol());
    }
    if (this.filtroEstado() !== 'TODOS') {
      const activo = this.filtroEstado() === 'ACTIVOS';
      res = res.filter(u => (u.estado ?? true) === activo);
    }
    this.usuariosFiltrados.set(res);
  }

  onBuscar(e: Event): void {
    this.busqueda.set((e.target as HTMLInputElement).value);
    this.aplicarFiltros();
  }

  onCambiarFiltroRol(e: Event): void {
    this.filtroRol.set((e.target as HTMLSelectElement).value);
    this.aplicarFiltros();
  }

  onCambiarFiltroEstado(e: Event): void {
    this.filtroEstado.set((e.target as HTMLSelectElement).value);
    this.aplicarFiltros();
  }

  abrirModalNuevo(): void {
    this.editandoId.set(null);
    this.form.reset({
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      rol: 'ESTUDIANTE',
      especialidad: '',
      estado: true
    });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.modalAbierto.set(true);
  }

  abrirModalEditar(u: Usuario): void {
    this.editandoId.set(u.id!);

    const perfil = this.tutoresPerfiles().find(tp => tp.usuario?.id === u.id);

    this.form.patchValue({
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      password: '',
      rol: u.rol,
      especialidad: perfil?.especialidad || '',
      estado: u.estado ?? true
    });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.editandoId.set(null);
  }

  guardarUsuario(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const esTutor = val.rol === 'TUTOR';

    const usuarioPayload: Usuario = {
      nombre: val.nombre!,
      apellido: val.apellido!,
      correo: val.correo!,
      rol: val.rol as any,
      estado: val.estado ?? true
    };
    if (val.password && val.password.trim().length > 0) {
      usuarioPayload.password = val.password.trim();
    }

    const idActual = this.editandoId();

    if (idActual) {
      // 1. Actualizar usuario existente
      this.usuarioService.actualizar(idActual, usuarioPayload).subscribe({
        next: () => {
          this.mostrarExito('Usuario actualizado exitosamente');
          this.cerrarModal(); // Cerrar SIEMPRE inmediatamente
          this.cargarDatos();

          // Sincronizar perfil de tutor si aplica
          if (esTutor) {
            this.sincronizarPerfilTutor(idActual, val.especialidad || 'Docencia Académica');
          }
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al actualizar usuario')
      });
    } else {
      // 2. Crear usuario nuevo
      this.usuarioService.crear(usuarioPayload).subscribe({
        next: (usrCreado) => {
          this.mostrarExito('Usuario creado exitosamente');
          this.cerrarModal(); // Cerrar SIEMPRE inmediatamente
          this.cargarDatos();

          if (esTutor && usrCreado.id) {
            this.sincronizarPerfilTutor(usrCreado.id, val.especialidad || 'Docencia Académica');
          }
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al crear usuario')
      });
    }
  }

  private sincronizarPerfilTutor(usuarioId: number, especialidad: string): void {
    const perfilExistente = this.tutoresPerfiles().find(tp => tp.usuario?.id === usuarioId);

    if (perfilExistente && perfilExistente.id) {
      this.tutorPerfilService.actualizar(perfilExistente.id, {
        usuario: { id: usuarioId },
        especialidad: especialidad,
        descripcion: perfilExistente.descripcion || 'Tutor oficial institucional',
        disponibilidad: perfilExistente.disponibilidad || 'Según agenda de tutorías'
      }).subscribe({
        next: () => this.cargarPerfilesTutores(),
        error: () => {}
      });
    } else {
      this.tutorPerfilService.crear({
        usuario: { id: usuarioId },
        especialidad: especialidad,
        descripcion: 'Tutor oficial institucional',
        disponibilidad: 'Según agenda de tutorías'
      }).subscribe({
        next: () => this.cargarPerfilesTutores(),
        error: () => {}
      });
    }
  }

  obtenerEspecialidadTutor(usuarioId?: number): string | null {
    if (!usuarioId) return null;
    const p = this.tutoresPerfiles().find(tp => tp.usuario?.id === usuarioId);
    return p?.especialidad || null;
  }

  toggleEstado(u: Usuario): void {
    const nuevoEstado = !(u.estado ?? true);
    this.usuarioService.cambiarEstado(u.id!, nuevoEstado).subscribe({
      next: () => {
        this.mostrarExito(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} con éxito`);
        this.cargarUsuarios();
      },
      error: () => this.mostrarError('Error al cambiar estado del usuario')
    });
  }

  eliminarUsuario(u: Usuario): void {
    if (!confirm(`¿Estás seguro de eliminar a ${u.nombre} ${u.apellido}?`)) return;

    this.usuarioService.eliminar(u.id!).subscribe({
      next: () => {
        this.mostrarExito('Usuario eliminado exitosamente');
        this.cargarDatos();
      },
      error: () => this.mostrarError('Error al eliminar usuario')
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
