import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html'
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mostrarPassword = signal(false);
  tabActivo = signal<'student' | 'tutor'>('student');
  cargando = signal(false);
  errorMensaje = signal<string | null>(null);

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.authService.redirigirPorRol();
    }
  }

  cambiarTab(tab: 'student' | 'tutor'): void {
    this.tabActivo.set(tab);
    const placeholder = tab === 'student' ? 'estudiante@universidad.edu.co' : 'docente.tutor@universidad.edu.co';
    this.form.get('correo')?.setValue('');
  }

  togglePassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid || this.cargando()) return;

    this.errorMensaje.set(null);
    this.cargando.set(true);

    const { correo, password } = this.form.value;

    this.authService.login({ correo: correo!, password: password! }).subscribe({
      next: () => {
        this.cargando.set(false);
        this.authService.redirigirPorRol();
      },
      error: (err) => {
        this.cargando.set(false);
        if (err.status === 401) {
          this.errorMensaje.set('Credenciales incorrectas. Verifica tu correo y contraseña.');
        } else if (err.status === 0) {
          this.errorMensaje.set('No se puede conectar al servidor. Verifica que el backend esté corriendo.');
        } else {
          this.errorMensaje.set('Error inesperado. Intenta nuevamente.');
        }
      }
    });
  }

  get correoInvalido(): boolean {
    const ctrl = this.form.get('correo');
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  get passwordInvalida(): boolean {
    const ctrl = this.form.get('password');
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
