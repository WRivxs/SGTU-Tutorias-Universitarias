import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

export interface EstudianteDemo {
  id: number;
  nombre: string;
  semestre: string;
  correo: string;
}

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
  private route = inject(ActivatedRoute);

  mostrarPassword = signal(false);
  tabActivo = signal<'student' | 'tutor'>('student');
  cargando = signal(false);
  errorMensaje = signal<string | null>(null);

  // Lista de 7 estudiantes registrados en la base de datos para pruebas simultaneas
  estudiantesDemo: EstudianteDemo[] = [
    { id: 1, nombre: 'Ana Martínez', semestre: '2° Sem', correo: 'ana.estudiante@tutorias.com' },
    { id: 2, nombre: 'Eduardo Bettin', semestre: '5° Sem', correo: 'eduardo.estudiante@tutorias.com' },
    { id: 3, nombre: 'Laura Gómez', semestre: '3° Sem', correo: 'laura.estudiante@tutorias.com' },
    { id: 4, nombre: 'Carlos Pérez', semestre: '1° Sem', correo: 'carlos.estudiante@tutorias.com' },
    { id: 5, nombre: 'Valentina Díaz', semestre: '4° Sem', correo: 'valentina.estudiante@tutorias.com' },
    { id: 6, nombre: 'Daniel Romero', semestre: '6° Sem', correo: 'daniel.estudiante@tutorias.com' },
    { id: 7, nombre: 'Sofía Castro', semestre: '3° Sem', correo: 'sofia.estudiante@tutorias.com' }
  ];

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.authService.redirigirPorRol();
      return;
    }

    // Auto-login por parámetro de URL (?estudiante=1 .. 7 o ?demo=estudiante)
    const paramEst = this.route.snapshot.queryParamMap.get('estudiante');
    const demo = this.route.snapshot.queryParamMap.get('demo');

    if (paramEst) {
      const idx = parseInt(paramEst, 10);
      const est = this.estudiantesDemo.find(e => e.id === idx) || this.estudiantesDemo[0];
      setTimeout(() => this.iniciarComoEstudiante(est), 200);
    } else if (demo === 'estudiante' || demo === 'student') {
      setTimeout(() => this.iniciarComoEstudiante(this.estudiantesDemo[0]), 200);
    }
  }

  iniciarComoEstudiante(est: EstudianteDemo): void {
    if (this.cargando()) return;
    this.tabActivo.set('student');
    this.form.patchValue({
      correo: est.correo,
      password: 'Estudiante123*'
    });
    this.onSubmit();
  }

  cambiarTab(tab: 'student' | 'tutor'): void {
    this.tabActivo.set(tab);
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
