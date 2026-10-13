import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/layout/sidebar/sidebar.component';
import { TutoriaService } from '../../../../core/services/tutoria.service';
import { Tutoria } from '../../../../shared/models/tutoria.model';

export interface DiaCalendario {
  fecha: Date;
  diaNumero: number;
  esMesActual: boolean;
  esHoy: boolean;
  tutorias: Tutoria[];
  fechaStr: string; // YYYY-MM-DD
}

@Component({
  selector: 'app-calendario-tutorias',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './calendario-tutorias.html'
})
export class CalendarioTutorias implements OnInit {
  private tutoriaService = inject(TutoriaService);

  tutorias = signal<Tutoria[]>([]);
  cargando = signal<boolean>(true);

  // Fecha actual visualizada en el calendario
  fechaVisualizada = signal<Date>(new Date());
  diaSeleccionado = signal<DiaCalendario | null>(null);

  nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Nombre formateado: "Octubre 2026"
  mesAnioTexto = computed(() => {
    const f = this.fechaVisualizada();
    return `${this.nombresMeses[f.getMonth()]} ${f.getFullYear()}`;
  });

  // Cálculo de los días a mostrar en la cuadrícula mensual
  diasCuadricula = computed<DiaCalendario[]>(() => {
    const visual = this.fechaVisualizada();
    const anio = visual.getFullYear();
    const mes = visual.getMonth();
    const hoy = new Date();

    const primerDiaMes = new Date(anio, mes, 1);
    const ultimoDiaMes = new Date(anio, mes + 1, 0);

    // Día de la semana del primer día (0=Dom, 1=Lun, ..., 6=Sáb)
    // Ajustamos para que Lunes sea 0 y Domingo sea 6
    let primerDiaSemana = primerDiaMes.getDay() - 1;
    if (primerDiaSemana === -1) primerDiaSemana = 6;

    const dias: DiaCalendario[] = [];

    // Días del mes anterior para rellenar la primera semana
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

    // Días del mes siguiente para completar la cuadrícula (hasta 35 o 42 celdas)
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

  // Lista de tutorías del día seleccionado
  tutoriasDiaSeleccionado = computed(() => {
    const sel = this.diaSeleccionado();
    if (!sel) return [];
    return this.obtenerTutoriasPorFecha(sel.fechaStr);
  });

  ngOnInit(): void {
    this.cargarTutorias();
  }

  cargarTutorias(): void {
    this.cargando.set(true);
    this.tutoriaService.listar().subscribe({
      next: (data) => {
        this.tutorias.set(data);
        this.cargando.set(false);

        // Seleccionar automáticamente el día de hoy si está en el mes actual
        const hoy = new Date();
        const hoyStr = this.formatearFechaISO(hoy);
        const hoyEncontrado = this.diasCuadricula().find(d => d.fechaStr === hoyStr);
        if (hoyEncontrado) {
          this.diaSeleccionado.set(hoyEncontrado);
        } else if (this.diasCuadricula().length > 0) {
          // O el primer día con tutorías
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

  seleccionarDia(dia: DiaCalendario): void {
    this.diaSeleccionado.set(dia);
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
