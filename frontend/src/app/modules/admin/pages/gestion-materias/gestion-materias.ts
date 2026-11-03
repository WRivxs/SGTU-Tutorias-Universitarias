import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/layout/sidebar/sidebar.component';
import { MateriaService } from '../../services/materia.service';
import { FacultadService } from '../../../../core/services/facultad.service';
import { ProgramaService } from '../../../../core/services/programa.service';
import { Materia } from '../../../../shared/models/materia.model';
import { Facultad } from '../../../../shared/models/facultad.model';
import { Programa } from '../../../../shared/models/programa.model';

@Component({
  selector: 'app-gestion-materias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './gestion-materias.html'
})
export class GestionMaterias implements OnInit {
  private materiaService = inject(MateriaService);
  private facultadService = inject(FacultadService);
  private programaService = inject(ProgramaService);
  private fb = inject(FormBuilder);

  materias = signal<Materia[]>([]);
  facultades = signal<Facultad[]>([]);
  programas = signal<Programa[]>([]);
  cargando = signal<boolean>(false);
  modalAbierto = signal<boolean>(false);
  editandoId = signal<number | null>(null);

  // Filtros de tabla
  filtroPrograma = signal<string>('TODOS');
  filtroSemestre = signal<string>('TODOS');

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  // Formulario con jerarquía en cascada: Facultad -> Programa -> Semestre -> Asignatura
  form = this.fb.group({
    facultadId: ['', [Validators.required]],
    programaId: ['', [Validators.required]],
    semestre: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    codigo: ['', [Validators.required, Validators.minLength(2)]],
    creditos: [3, [Validators.required, Validators.min(1)]],
    descripcion: [''],
    estado: [true]
  });

  // Signal reactiva para la facultad seleccionada en el formulario
  facultadSeleccionadaModal = signal<string>('');

  // Lista reactiva de programas según la facultad seleccionada en el formulario
  programasParaModal = computed(() => {
    const facId = this.facultadSeleccionadaModal();
    if (!facId) return [];
    return this.programas().filter(p => p.facultad?.id === Number(facId));
  });

  // Filtrado de la tabla de materias
  materiasFiltradas = computed(() => {
    let list = this.materias();
    const progId = this.filtroPrograma();
    const sem = this.filtroSemestre();

    if (progId !== 'TODOS') {
      list = list.filter(m => m.programa?.id === Number(progId));
    }
    if (sem !== 'TODOS') {
      list = list.filter(m => m.semestre === Number(sem));
    }
    return list;
  });

  ngOnInit(): void {
    this.cargarDatos();

    // Sincronizar automáticamente la signal con cualquier cambio de facultad
    this.form.get('facultadId')?.valueChanges.subscribe(val => {
      this.facultadSeleccionadaModal.set(val ? String(val) : '');
    });
  }

  cargarDatos(): void {
    this.cargando.set(true);

    this.facultadService.listar().subscribe({
      next: (facs) => this.facultades.set(facs),
      error: () => {}
    });

    this.programaService.listar().subscribe({
      next: (progs) => this.programas.set(progs),
      error: () => {}
    });

    this.materiaService.listar().subscribe({
      next: (data) => {
        this.materias.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.mostrarError('Error al cargar catálogo de materias');
        this.cargando.set(false);
      }
    });
  }

  onFacultadChange(): void {
    const facId = this.form.get('facultadId')?.value || '';
    this.facultadSeleccionadaModal.set(facId);
    // Al cambiar de facultad, limpiar el programa seleccionado para obligar a elegir uno de esa facultad
    this.form.patchValue({ programaId: '' });
  }

  abrirModalNuevo(): void {
    this.editandoId.set(null);
    const primeraFacultad = this.facultades().length > 0 ? String(this.facultades()[0].id) : '';
    this.facultadSeleccionadaModal.set(primeraFacultad);
    const progs = this.programas().filter(p => p.facultad?.id === Number(primeraFacultad));
    const primerPrograma = progs.length > 0 ? String(progs[0].id) : '';

    this.form.reset({
      facultadId: primeraFacultad,
      programaId: primerPrograma,
      semestre: 1,
      nombre: '',
      codigo: '',
      creditos: 3,
      descripcion: '',
      estado: true
    });
    this.modalAbierto.set(true);
  }

  abrirModalEditar(m: Materia): void {
    this.editandoId.set(m.id!);
    const facId = m.programa?.facultad?.id ? String(m.programa.facultad.id) : '';
    const progId = m.programa?.id ? String(m.programa.id) : '';
    this.facultadSeleccionadaModal.set(facId);

    this.form.patchValue({
      facultadId: facId,
      programaId: progId,
      semestre: m.semestre,
      nombre: m.nombre,
      codigo: m.codigo,
      creditos: m.creditos ?? 3,
      descripcion: m.descripcion || '',
      estado: m.estado ?? true
    });
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.editandoId.set(null);
  }

  guardarMateria(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const payload: Materia = {
      programa: { id: Number(val.programaId) } as Programa,
      semestre: Number(val.semestre),
      nombre: val.nombre!,
      codigo: val.codigo!.toUpperCase().trim(),
      creditos: Number(val.creditos),
      descripcion: val.descripcion || '',
      estado: val.estado ?? true
    };

    if (this.editandoId()) {
      this.materiaService.actualizar(this.editandoId()!, payload).subscribe({
        next: () => {
          this.mostrarExito('Materia actualizada con éxito');
          this.cerrarModal();
          this.cargarDatos();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al actualizar materia')
      });
    } else {
      this.materiaService.crear(payload).subscribe({
        next: () => {
          this.mostrarExito('Materia registrada con éxito');
          this.cerrarModal();
          this.cargarDatos();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al crear materia')
      });
    }
  }

  eliminarMateria(m: Materia): void {
    if (!confirm(`¿Eliminar la materia ${m.nombre}?`)) return;

    this.materiaService.eliminar(m.id!).subscribe({
      next: () => {
        this.mostrarExito('Materia eliminada con éxito');
        this.cargarDatos();
      },
      error: () => this.mostrarError('Error al eliminar materia')
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
