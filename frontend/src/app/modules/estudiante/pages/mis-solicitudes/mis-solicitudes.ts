import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarEstudianteComponent } from '../../../../shared/components/layout/sidebar-estudiante/sidebar-estudiante.component';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Solicitud } from '../../../../shared/models/solicitud.model';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarEstudianteComponent],
  templateUrl: './mis-solicitudes.html'
})
export class MisSolicitudes implements OnInit {
  private solicitudService = inject(SolicitudService);
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  usuario = this.authService.usuario;

  solicitudes = signal<Solicitud[]>([]);
  cargando = signal<boolean>(true);
  filtroEstado = signal<string>('TODAS');

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  solicitudesFiltradas = computed(() => {
    const list = this.solicitudes();
    const est = this.filtroEstado();
    if (est === 'TODAS') return list;
    return list.filter(s => s.estado === est);
  });

  totalAceptadas = computed(() => this.solicitudes().filter(s => s.estado === 'ACEPTADA').length);
  totalPendientes = computed(() => this.solicitudes().filter(s => s.estado === 'PENDIENTE').length);

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    const u = this.usuario();
    if (!u || !u.id) {
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);
    this.solicitudService.listar(u.id).subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.mostrarError('Error al cargar tus solicitudes');
        this.cargando.set(false);
      }
    });
  }

  cambiarFiltro(est: string): void {
    this.filtroEstado.set(est);
  }

  cancelarSolicitud(s: Solicitud): void {
    this.dialogService.confirmar({
      titulo: 'Cancelar Solicitud',
      mensaje: `¿Cancelar tu solicitud para la tutoria de "${s.tutoria?.materia?.nombre}"? Podras volver a solicitarla.`,
      tipo: 'peligro',
      textoBtnConfirmar: 'Si, Cancelar',
      onConfirmar: () => this._doCancelarSolicitud(s)
    });
  }

  private _doCancelarSolicitud(s: Solicitud): void {

    this.solicitudService.eliminar(s.id!).subscribe({
      next: () => {
        this.mostrarExito('Solicitud cancelada con éxito');
        this.cargarSolicitudes();
      },
      error: (err) => {
        this.mostrarError(err.error?.mensaje || 'Error al cancelar la solicitud');
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
