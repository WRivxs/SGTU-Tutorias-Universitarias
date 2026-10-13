import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarTutorComponent } from '../../../../shared/components/layout/sidebar-tutor/sidebar-tutor.component';
import { TutoriaService } from '../../../../core/services/tutoria.service';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Tutoria } from '../../../../shared/models/tutoria.model';
import { Solicitud } from '../../../../shared/models/solicitud.model';

export interface DiaAgenda {
  fecha: Date;
  diaNumero: number;
  esMesActual: boolean;
  esHoy: boolean;
  tutorias: Tutoria[];
  fechaStr: string; // YYYY-MM-DD
}

@Component({
  selector: 'app-agenda-tutor',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarTutorComponent],
  templateUrl: './agenda.html'
})
export class Agenda implements OnInit {
  private tutoriaService = inject(TutoriaService);
  private solicitudService = inject(SolicitudService);
  private authService = inject(AuthService);

  usuario = this.authService.usuario;

  tutorias = signal<Tutoria[]>([]);
  solicitudes = signal<Solicitud[]>([]);
  cargando = signal<boolean>(true);

  fechaVisualizada = signal<Date>(new Date());
  diaSeleccionado = signal<DiaAgenda | null>(null);

  nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  mesAnioTexto = computed(() => {
    const f = this.fechaVisualizada();
    return `${this.nombresMeses[f.getMonth()]} ${f.getFullYear()}`;
  });

  diasCuadricula = computed<DiaAgenda[]>(() => {
    const visual = this.fechaVisualizada();
    const anio = visual.getFullYear();
    const mes = visual.getMonth();
    const hoy = new Date();

    const primerDiaMes = new Date(anio, mes, 1);
    const ultimoDiaMes = new Date(anio, mes + 1, 0);

    let primerDiaSemana = primerDiaMes.getDay() - 1;
    if (primerDiaSemana === -1) primerDiaSemana = 6;

    const dias: DiaAgenda[] = [];

    // Días del mes anterior
    const diasMesAnterior = new Date(anio, mes, 0).getDate();
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const d = new Date(anio, mes - 1, diasMesAnterior - i);
      const str = this.formatearFechaISO(d);
      dias.push({
        fecha: d,
        diaNumero: d.getDate(),
        esMesActual: false,
        esHoy: this.esMismoDia(d, hoy),
        tutorias: this.obtenerTutoriasPorFecha(str),
        fechaStr: str
      });
    }

    // Días del mes actual
    for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
      const d = new Date(anio, mes, i);
      const str = this.formatearFechaISO(d);
      dias.push({
        fecha: d,
        diaNumero: i,
        esMesActual: true,
        esHoy: this.esMismoDia(d, hoy),
        tutorias: this.obtenerTutoriasPorFecha(str),
        fechaStr: str
      });
    }

    // Días del mes siguiente
    const celdasRestantes = (7 - (dias.length % 7)) % 7;
    for (let i = 1; i <= celdasRestantes; i++) {
      const d = new Date(anio, mes + 1, i);
      const str = this.formatearFechaISO(d);
      dias.push({
        fecha: d,
        diaNumero: i,
        esMesActual: false,
        esHoy: this.esMismoDia(d, hoy),
        tutorias: this.obtenerTutoriasPorFecha(str),
        fechaStr: str
      });
    }

    return dias;
  });

  tutoriasDiaSeleccionado = computed(() => {
    const sel = this.diaSeleccionado();
    if (!sel) return [];
    return this.obtenerTutoriasPorFecha(sel.fechaStr);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    this.solicitudService.listar().subscribe({
      next: (sols) => this.solicitudes.set(sols),
      error: () => {}
    });

    this.tutoriaService.listar().subscribe({
      next: (data) => {
        const u = this.usuario();
        if (u) {
          const delTutor = data.filter(t =>
            t.tutor?.usuario?.correo === u.correo ||
            t.tutor?.usuario?.nombre === u.nombre
          );
          this.tutorias.set(delTutor);
        } else {
          this.tutorias.set(data);
        }
        this.cargando.set(false);

        const hoy = new Date();
        const hoyStr = this.formatearFechaISO(hoy);
        const hoyEncontrado = this.diasCuadricula().find(d => d.fechaStr === hoyStr);
        if (hoyEncontrado) {
          this.diaSeleccionado.set(hoyEncontrado);
        } else if (this.diasCuadricula().length > 0) {
          const primerConTutoria = this.diasCuadricula().find(d => d.tutorias.length > 0);
          this.diaSeleccionado.set(primerConTutoria || this.diasCuadricula()[0]);
        }
      },
      error: () => this.cargando.set(false)
    });
  }

  mesAnterior(): void {
    const f = this.fechaVisualizada();
    this.fechaVisualizada.set(new Date(f.getFullYear(), f.getMonth() - 1, 1));
  }

  mesSiguiente(): void {
    const f = this.fechaVisualizada();
    this.fechaVisualizada.set(new Date(f.getFullYear(), f.getMonth() + 1, 1));
  }

  irAHoy(): void {
    this.fechaVisualizada.set(new Date());
    const hoyStr = this.formatearFechaISO(new Date());
    const hoyEncontrado = this.diasCuadricula().find(d => d.fechaStr === hoyStr);
    if (hoyEncontrado) {
      this.diaSeleccionado.set(hoyEncontrado);
    }
  }

  seleccionarDia(dia: DiaAgenda): void {
    this.diaSeleccionado.set(dia);
  }

  obtenerInscritos(tutoriaId?: number): Solicitud[] {
    if (!tutoriaId) return [];
    return this.solicitudes().filter(s => s.tutoria?.id === tutoriaId && s.estado === 'ACEPTADA');
  }

  private obtenerTutoriasPorFecha(fechaStr: string): Tutoria[] {
    return this.tutorias().filter(t => t.fecha === fechaStr);
  }

  private formatearFechaISO(d: Date): string {
    const anio = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  private esMismoDia(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }
}
