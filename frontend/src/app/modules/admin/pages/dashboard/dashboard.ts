import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/layout/sidebar/sidebar.component';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { MateriaService } from '../../services/materia.service';
import { TutoriaService } from '../../../../core/services/tutoria.service';
import { SolicitudService } from '../../../../core/services/solicitud.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarComponent],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private materiaService = inject(MateriaService);
  private tutoriaService = inject(TutoriaService);
  private solicitudService = inject(SolicitudService);

  usuario = this.authService.usuario;

  totalUsuarios = signal<number>(0);
  alumnosCount = signal<number>(0);
  tutoresCount = signal<number>(0);
  adminsCount = signal<number>(0);

  totalMaterias = signal<number>(0);
  totalTutorias = signal<number>(0);
  totalSolicitudes = signal<number>(0);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.cargando.set(true);

    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        this.totalUsuarios.set(usuarios.length);
        this.alumnosCount.set(usuarios.filter(u => u.rol === 'ESTUDIANTE').length);
        this.tutoresCount.set(usuarios.filter(u => u.rol === 'TUTOR').length);
        this.adminsCount.set(usuarios.filter(u => u.rol === 'ADMINISTRADOR').length);
      },
      error: () => {}
    });

    this.materiaService.listar().subscribe({
      next: (materias) => this.totalMaterias.set(materias.length),
      error: () => {}
    });

    this.tutoriaService.listar().subscribe({
      next: (tutorias) => this.totalTutorias.set(tutorias.length),
      error: () => {}
    });

    this.solicitudService.listar().subscribe({
      next: (solicitudes) => {
        this.totalSolicitudes.set(solicitudes.length);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}
