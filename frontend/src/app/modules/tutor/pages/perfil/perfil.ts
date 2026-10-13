import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarTutorComponent } from '../../../../shared/components/layout/sidebar-tutor/sidebar-tutor.component';
import { TutorPerfilService, TutorPerfil } from '../../../../core/services/tutor-perfil.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-perfil-tutor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarTutorComponent],
  templateUrl: './perfil.html'
})
export class PerfilTutor implements OnInit {
  private tutorPerfilService = inject(TutorPerfilService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  usuario = this.authService.usuario;
  perfil = signal<TutorPerfil | null>(null);
  cargando = signal<boolean>(true);
  guardando = signal<boolean>(false);

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  mostrarPassword = signal<boolean>(false);

  formPerfil = this.fb.group({
    especialidad: ['', [Validators.required]],
    disponibilidad: ['', [Validators.required]],
    descripcion: ['']
  });

  formCuenta = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    correo: [{ value: '', disabled: true }],
    password: ['', [Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    const u = this.usuario();

    if (u) {
      this.formCuenta.patchValue({
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo,
        password: ''
      });

      if (u.id) {
        this.tutorPerfilService.obtenerPorUsuarioId(u.id).subscribe({
          next: (p) => {
            this.perfil.set(p);
            this.formPerfil.patchValue({
              especialidad: p.especialidad || '',
              disponibilidad: p.disponibilidad || '',
              descripcion: p.descripcion || ''
            });
            this.cargando.set(false);
          },
          error: () => {
            // Si aún no tiene perfil, cargamos lista
            this.tutorPerfilService.listar().subscribe({
              next: (lista) => {
                const encontrado = lista.find(t => t.usuario?.id === u.id);
                if (encontrado) {
                  this.perfil.set(encontrado);
                  this.formPerfil.patchValue({
                    especialidad: encontrado.especialidad || '',
                    disponibilidad: encontrado.disponibilidad || '',
                    descripcion: encontrado.descripcion || ''
                  });
                }
                this.cargando.set(false);
              },
              error: () => this.cargando.set(false)
            });
          }
        });
      } else {
        this.cargando.set(false);
      }
    } else {
      this.cargando.set(false);
    }
  }

  guardarPerfilDocente(): void {
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const val = this.formPerfil.value;
    const u = this.usuario();
    const p = this.perfil();

    if (!u || !u.id) {
      this.mostrarError('No se encontró la sesión del usuario');
      this.guardando.set(false);
      return;
    }

    const payload: TutorPerfil = {
      usuario: { id: u.id },
      especialidad: val.especialidad || '',
      disponibilidad: val.disponibilidad || '',
      descripcion: val.descripcion || ''
    };

    if (p && p.id) {
      this.tutorPerfilService.actualizar(p.id, payload).subscribe({
        next: (act) => {
          this.perfil.set(act);
          this.mostrarExito('Perfil docente actualizado exitosamente');
          this.guardando.set(false);
        },
        error: () => {
          this.mostrarError('Error al actualizar perfil docente');
          this.guardando.set(false);
        }
      });
    } else {
      this.tutorPerfilService.crear(payload).subscribe({
        next: (creado) => {
          this.perfil.set(creado);
          this.mostrarExito('Perfil docente creado exitosamente');
          this.guardando.set(false);
        },
        error: () => {
          this.mostrarError('Error al guardar perfil');
          this.guardando.set(false);
        }
      });
    }
  }

  guardarDatosCuenta(): void {
    if (this.formCuenta.invalid) {
      this.formCuenta.markAllAsTouched();
      return;
    }

    const u = this.usuario();
    if (!u || !u.id) return;

    this.guardando.set(true);
    const val = this.formCuenta.value;

    const payload: any = {
      nombre: val.nombre,
      apellido: val.apellido,
      correo: u.correo,
      rol: u.rol,
      estado: true
    };

    if (val.password && val.password.trim().length >= 6) {
      payload.password = val.password.trim();
    }

    this.usuarioService.actualizar(u.id, payload).subscribe({
      next: (usrActualizado) => {
        // Actualizamos usuario en localStorage y AuthService
        localStorage.setItem('sgtu_usuario', JSON.stringify({
          ...u,
          nombre: usrActualizado.nombre,
          apellido: usrActualizado.apellido
        }));
        this.mostrarExito('Datos de cuenta actualizados exitosamente');
        this.formCuenta.patchValue({ password: '' });
        this.guardando.set(false);
      },
      error: (err) => {
        this.mostrarError(err.error?.mensaje || 'Error al actualizar cuenta');
        this.guardando.set(false);
      }
    });
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
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
