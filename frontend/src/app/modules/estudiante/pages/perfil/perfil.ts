import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarEstudianteComponent } from '../../../../shared/components/layout/sidebar-estudiante/sidebar-estudiante.component';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';

/* Validador de coincidencia de contraseñas */
function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl) => {
    const nueva    = group.get('nuevaContrasena')?.value;
    const confirmar = group.get('confirmarContrasena')?.value;
    return nueva && confirmar && nueva !== confirmar
      ? { noCoinciden: true }
      : null;
  };
}

@Component({
  selector: 'app-perfil-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarEstudianteComponent],
  templateUrl: './perfil.html'
})
export class PerfilEstudiante implements OnInit {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioSvc  = inject(UsuarioService);

  usuario = this.authService.usuario;

  guardandoCuenta = signal<boolean>(false);
  exitoCuenta     = signal<string | null>(null);
  errorCuenta     = signal<string | null>(null);

  cuentaForm = this.fb.group({
    nombre:             ['', [Validators.required, Validators.minLength(2)]],
    apellido:           ['', [Validators.required, Validators.minLength(2)]],
    nuevaContrasena:    ['', [Validators.minLength(6)]],
    confirmarContrasena:['']
  }, { validators: passwordMatchValidator() });

  ngOnInit(): void {
    const u = this.usuario();
    if (u) {
      this.cuentaForm.patchValue({
        nombre:  u.nombre  || '',
        apellido: u.apellido || ''
      });
    }
  }

  guardarCuenta(): void {
    if (this.cuentaForm.invalid) {
      this.cuentaForm.markAllAsTouched();
      return;
    }
    const u = this.usuario();
    if (!u?.id) return;

    const v = this.cuentaForm.value;
    const payload: Record<string, unknown> = {
      nombre:   v.nombre,
      apellido: v.apellido
    };
    if (v.nuevaContrasena) {
      payload['contrasena'] = v.nuevaContrasena;
    }

    this.guardandoCuenta.set(true);
    this.usuarioSvc.actualizar(u.id, payload).subscribe({
      next: () => {
        this.guardandoCuenta.set(false);
        this.cuentaForm.patchValue({ nuevaContrasena: '', confirmarContrasena: '' });
        this.exitoCuenta.set('Datos actualizados correctamente.');
        setTimeout(() => this.exitoCuenta.set(null), 3500);
      },
      error: (err) => {
        this.guardandoCuenta.set(false);
        this.errorCuenta.set(err.error?.mensaje || 'Error al actualizar los datos.');
        setTimeout(() => this.errorCuenta.set(null), 4000);
      }
    });
  }

  /* Helpers de validación para la plantilla */
  campoInvalido(campo: string): boolean {
    const c = this.cuentaForm.get(campo);
    return !!(c?.invalid && c?.touched);
  }
}
