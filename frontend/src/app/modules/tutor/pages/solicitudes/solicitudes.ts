import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarTutorComponent } from '../../../../shared/components/layout/sidebar-tutor/sidebar-tutor.component';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { TutorPerfilService } from '../../../../core/services/tutor-perfil.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Solicitud, EstadoSolicitud } from '../../../../shared/models/solicitud.model';

@Component({
  selector: 'app-solicitudes-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarTutorComponent],
  templateUrl: './solicitudes.html'
})
export class Solicitudes implements OnInit {
  private solicitudService = inject(SolicitudService);
  private tutorPerfilService = inject(TutorPerfilService);
  private authService = inject(AuthService);

  usuario = this.authService.usuario;
  solicitudes = signal<Solicitud[]>([]);
  cargando = signal<boolean>(true);

  filtroEstado = signal<string>('TODAS');

  // Modal para rechazar con motivo
  modalRechazoAbierto = signal<boolean>(false);
  solicitudARechazar = signal<Solicitud | null>(null);
  motivoRechazo = signal<string>('');

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  solicitudesFiltradas = computed(() => {
    const list = this.solicitudes();
    const est = this.filtroEstado();
    if (est === 'TODAS') return list;
    return list.filter(s => s.estado === est);
  });

  totalPendientes = computed(() => {
    return this.solicitudes().filter(s => s.estado === 'PENDIENTE').length;
  });

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando.set(true);
    this.solicitudService.listar().subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.mostrarError('Error al cargar solicitudes');
        this.cargando.set(false);
      }
    });
  }

  cambiarFiltro(est: string): void {
    this.filtroEstado.set(est);
  }

  aceptarSolicitud(s: Solicitud): void {
    if (!confirm(`¿Aceptar la solicitud de ${s.estudiante?.nombre || 'el estudiante'}?`)) return;

    this.solicitudService.responder(s.id!, 'ACEPTADA').subscribe({
      next: () => {
        this.mostrarExito('Solicitud ACEPTADA. La tutoría ha sido confirmada.');
        this.cargarSolicitudes();
      },
      error: (err) => this.mostrarError(err.error?.mensaje || 'Error al aceptar solicitud')
    });
  }

  abrirModalRechazar(s: Solicitud): void {
    this.solicitudARechazar.set(s);
    this.motivoRechazo.set('');
    this.modalRechazoAbierto.set(true);
  }

  cerrarModalRechazo(): void {
    this.modalRechazoAbierto.set(false);
    this.solicitudARechazar.set(null);
  }

  confirmarRechazo(): void {
    const s = this.solicitudARechazar();
    if (!s) return;

    const comentario = this.motivoRechazo().trim() || 'No disponible en este horario';

    this.solicitudService.responder(s.id!, 'RECHAZADA', comentario).subscribe({
      next: () => {
        this.mostrarExito('Solicitud rechazada.');
        this.cerrarModalRechazo();
        this.cargarSolicitudes();
      },
      error: (err) => this.mostrarError(err.error?.mensaje || 'Error al rechazar solicitud')
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
