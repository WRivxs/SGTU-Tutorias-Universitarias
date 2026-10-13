import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarEstudianteComponent } from '../../../../shared/components/layout/sidebar-estudiante/sidebar-estudiante.component';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Solicitud } from '../../../../shared/models/solicitud.model';
import { Tutoria } from '../../../../shared/models/tutoria.model';

export interface DiaAgendaEstudiante {
  fecha: Date;
  diaNumero: number;
  esMesActual: boolean;
  esHoy: boolean;
  tutorias: Tutoria[];
  fechaStr: string; // YYYY-MM-DD
}

@Component({
  selector: 'app-horario-estudiante',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarEstudianteComponent],
  templateUrl: './horario.html'
})
export class HorarioEstudiante implements OnInit {
  private solicitudService = inject(SolicitudService);
  private authService     = inject(AuthService);

  usuario  = this.authService.usuario;
  cargando = signal<boolean>(true);

  /* Solo solicitudes ACEPTADAS */
  solicitudesAceptadas = signal<Solicitud[]>([]);

  /* Navegación mensual */
  fechaVisualizada = signal<Date>(new Date());
  diaSeleccionado  = signal<DiaAgendaEstudiante | null>(null);

  nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  mesAnioTexto = computed(() => {
    const f = this.fechaVisualizada();
    return `${this.nombresMeses[f.getMonth()]} ${f.getFullYear()}`;
  });

  diasCuadricula = computed<DiaAgendaEstudiante[]>(() => {
    const visual = this.fechaVisualizada();
    const anio = visual.getFullYear();
    const mes = visual.getMonth();
    const hoy = new Date();

    const primerDiaMes = new Date(anio, mes, 1);
    const ultimoDiaMes = new Date(anio, mes + 1, 0);

    let primerDiaSemana = primerDiaMes.getDay() - 1;
    if (primerDiaSemana === -1) primerDiaSemana = 6;

    const dias: DiaAgendaEstudiante[] = [];

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
    const u = this.usuario();
    if (!u?.id) { this.cargando.set(false); return; }

    this.solicitudService.listar(u.id).subscribe({
      next: (data) => {
        this.solicitudesAceptadas.set(data.filter(s => s.estado === 'ACEPTADA'));
        this.cargando.set(false);

        // Seleccionar automáticamente el día de hoy
        const hoyStr = this.formatearFechaISO(new Date());
        const hoyItem = this.diasCuadricula().find(d => d.fechaStr === hoyStr);
        if (hoyItem) {
          this.diaSeleccionado.set(hoyItem);
        }
      },
      error: () => this.cargando.set(false)
    });
  }

  obtenerTutoriasPorFecha(fechaStr: string): Tutoria[] {
    return this.solicitudesAceptadas()
      .filter(s => s.tutoria?.fecha === fechaStr)
      .map(s => s.tutoria!);
  }

  seleccionarDia(dia: DiaAgendaEstudiante): void {
    this.diaSeleccionado.set(dia);
  }

  irAHoy(): void {
    this.fechaVisualizada.set(new Date());
    const hoyStr = this.formatearFechaISO(new Date());
    const hoyItem = this.diasCuadricula().find(d => d.fechaStr === hoyStr);
    if (hoyItem) {
      this.diaSeleccionado.set(hoyItem);
    }
  }

  mesAnterior(): void {
    const actual = this.fechaVisualizada();
    this.fechaVisualizada.set(new Date(actual.getFullYear(), actual.getMonth() - 1, 1));
  }

  mesSiguiente(): void {
    const actual = this.fechaVisualizada();
    this.fechaVisualizada.set(new Date(actual.getFullYear(), actual.getMonth() + 1, 1));
  }

  private formatearFechaISO(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private esMismoDia(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }
}
