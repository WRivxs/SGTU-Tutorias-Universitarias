import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarTutorComponent } from '../../../../shared/components/layout/sidebar-tutor/sidebar-tutor.component';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { DocenteService } from '../../../../core/services/docente.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Solicitud, EstadoSolicitud } from '../../../../shared/models/solicitud.model';
import { Docente } from '../../../../shared/models/docente.model';

@Component({
  selector: 'app-solicitudes-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarTutorComponent],
  templateUrl: './solicitudes.html'
})
export class Solicitudes implements OnInit {
  private solicitudService = inject(SolicitudService);
  private docenteService = inject(DocenteService);
  private authService = inject(AuthService);

  usuario = this.authService.usuario;
  perfilDocente = signal<Docente | null>(null);

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
    this.cargarDatosDocente();
  }

  cargarDatosDocente(): void {
    this.cargando.set(true);
    const u = this.usuario();

    if (u && u.id) {
      this.docenteService.obtenerPorUsuarioId(u.id).subscribe({
        next: (doc) => {
          this.perfilDocente.set(doc);
          this.cargarSolicitudes(doc.id);
        },
        error: () => {
          this.docenteService.listar().subscribe({
            next: (lista) => {
              const doc = lista.find(d => d.usuario?.id === u.id || d.usuario?.correo === u.correo);
              if (doc) {
                this.perfilDocente.set(doc);
                this.cargarSolicitudes(doc.id);
              } else {
                this.cargarSolicitudes();
              }
            },
            error: () => this.cargarSolicitudes()
          });
        }
      });
    } else {
      this.cargarSolicitudes();
    }
  }

  cargarSolicitudes(docenteId?: number): void {
    this.cargando.set(true);
    const u = this.usuario();

    this.solicitudService.listar(undefined, undefined, docenteId).subscribe({
      next: (data) => {
        // Filtro de seguridad estricto en frontend: solo mostrar solicitudes de tutorías pertenecientes a este docente
        let delDocente = data;
        if (u) {
          delDocente = data.filter(s => {
            const docenteTutoria = s.tutoria?.docente || s.tutoria?.tutor;
            if (!docenteTutoria) return false;
            return (
              docenteTutoria.usuario?.id === u.id ||
              docenteTutoria.usuario?.correo?.toLowerCase() === u.correo?.toLowerCase() ||
              (docenteId && docenteTutoria.id === docenteId)
            );
          });
        }
        this.solicitudes.set(delDocente);
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
    const nombreEst = s.estudiante?.usuario?.nombre || s.estudiante?.nombre || 'el estudiante';
    if (!confirm(`¿Aceptar la solicitud de ${nombreEst}?`)) return;

    this.solicitudService.responder(s.id!, 'ACEPTADA').subscribe({
      next: () => {
        this.mostrarExito('Solicitud ACEPTADA. La tutoría ha sido confirmada.');
        this.cargarSolicitudes(this.perfilDocente()?.id);
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
        this.cargarSolicitudes(this.perfilDocente()?.id);
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
