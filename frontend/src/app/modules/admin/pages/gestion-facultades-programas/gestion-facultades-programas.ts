import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/layout/sidebar/sidebar.component';
import { FacultadService } from '../../../../core/services/facultad.service';
import { ProgramaService } from '../../../../core/services/programa.service';
import { Facultad } from '../../../../shared/models/facultad.model';
import { Programa } from '../../../../shared/models/programa.model';

@Component({
  selector: 'app-gestion-facultades-programas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './gestion-facultades-programas.html'
})
export class GestionFacultadesProgramas implements OnInit {
  private facultadService = inject(FacultadService);
  private programaService = inject(ProgramaService);
  private fb = inject(FormBuilder);

  pestanaActiva = signal<'FACULTADES' | 'PROGRAMAS'>('FACULTADES');
  facultades = signal<Facultad[]>([]);
  programas = signal<Programa[]>([]);
  cargando = signal<boolean>(false);

  // Modales
  modalFacultadAbierto = signal<boolean>(false);
  modalProgramaAbierto = signal<boolean>(false);
  editandoFacultadId = signal<number | null>(null);
  editandoProgramaId = signal<number | null>(null);

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  formFacultad = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    codigo: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    estado: [true]
  });

  formPrograma = this.fb.group({
    facultadId: ['', [Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    codigo: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    estado: [true]
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.facultadService.listar().subscribe({
      next: (facs) => {
        this.facultades.set(facs);
        this.programaService.listar().subscribe({
          next: (progs) => {
            this.programas.set(progs);
            this.cargando.set(false);
          },
          error: () => this.cargando.set(false)
        });
      },
      error: () => this.cargando.set(false)
    });
  }

  cambiarPestana(tab: 'FACULTADES' | 'PROGRAMAS'): void {
    this.pestanaActiva.set(tab);
  }

  // --- MÉTODOS FACULTAD ---
  abrirModalFacultadNuevo(): void {
    this.editandoFacultadId.set(null);
    this.formFacultad.reset({ nombre: '', codigo: '', descripcion: '', estado: true });
    this.modalFacultadAbierto.set(true);
  }

  abrirModalFacultadEditar(f: Facultad): void {
    this.editandoFacultadId.set(f.id!);
    this.formFacultad.patchValue({
      nombre: f.nombre,
      codigo: f.codigo,
      descripcion: f.descripcion || '',
      estado: f.estado ?? true
    });
    this.modalFacultadAbierto.set(true);
  }

  cerrarModalFacultad(): void {
    this.modalFacultadAbierto.set(false);
    this.editandoFacultadId.set(null);
  }

  guardarFacultad(): void {
    if (this.formFacultad.invalid) {
      this.formFacultad.markAllAsTouched();
      return;
    }
    const val = this.formFacultad.value;
    const payload: Facultad = {
      nombre: val.nombre!,
      codigo: val.codigo!.toUpperCase().trim(),
      descripcion: val.descripcion || '',
      estado: val.estado ?? true
    };

    if (this.editandoFacultadId()) {
      this.facultadService.actualizar(this.editandoFacultadId()!, payload).subscribe({
        next: () => {
          this.mostrarExito('Facultad actualizada con éxito');
          this.cerrarModalFacultad();
          this.cargarDatos();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al actualizar facultad')
      });
    } else {
      this.facultadService.crear(payload).subscribe({
        next: () => {
          this.mostrarExito('Facultad registrada exitosamente');
          this.cerrarModalFacultad();
          this.cargarDatos();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al registrar facultad')
      });
    }
  }

  eliminarFacultad(f: Facultad): void {
    if (!confirm(`¿Eliminar la facultad ${f.nombre}? (Nota: No debe tener programas asociados)`)) return;
    this.facultadService.eliminar(f.id!).subscribe({
      next: () => {
        this.mostrarExito('Facultad eliminada con éxito');
        this.cargarDatos();
      },
      error: (err) => this.mostrarError(err.error?.mensaje || 'No se puede eliminar la facultad porque tiene registros asociados')
    });
  }

  // --- MÉTODOS PROGRAMA ---
  abrirModalProgramaNuevo(): void {
    this.editandoProgramaId.set(null);
    this.formPrograma.reset({
      facultadId: this.facultades().length > 0 ? String(this.facultades()[0].id) : '',
      nombre: '',
      codigo: '',
      descripcion: '',
      estado: true
    });
    this.modalProgramaAbierto.set(true);
  }

  abrirModalProgramaEditar(p: Programa): void {
    this.editandoProgramaId.set(p.id!);
    this.formPrograma.patchValue({
      facultadId: p.facultad?.id ? String(p.facultad.id) : '',
      nombre: p.nombre,
      codigo: p.codigo,
      descripcion: p.descripcion || '',
      estado: p.estado ?? true
    });
    this.modalProgramaAbierto.set(true);
  }

  cerrarModalPrograma(): void {
    this.modalProgramaAbierto.set(false);
    this.editandoProgramaId.set(null);
  }

  guardarPrograma(): void {
    if (this.formPrograma.invalid) {
      this.formPrograma.markAllAsTouched();
      return;
    }
    const val = this.formPrograma.value;
    const payload: Programa = {
      facultad: { id: Number(val.facultadId) } as Facultad,
      nombre: val.nombre!,
      codigo: val.codigo!.toUpperCase().trim(),
      descripcion: val.descripcion || '',
      estado: val.estado ?? true
    };

    if (this.editandoProgramaId()) {
      this.programaService.actualizar(this.editandoProgramaId()!, payload).subscribe({
        next: () => {
          this.mostrarExito('Programa académico actualizado con éxito');
          this.cerrarModalPrograma();
          this.cargarDatos();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al actualizar programa')
      });
    } else {
      this.programaService.crear(payload).subscribe({
        next: () => {
          this.mostrarExito('Programa académico registrado exitosamente');
          this.cerrarModalPrograma();
          this.cargarDatos();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al registrar programa')
      });
    }
  }

  eliminarPrograma(p: Programa): void {
    if (!confirm(`¿Eliminar el programa ${p.nombre}? (Nota: No debe tener materias ni estudiantes asociados)`)) return;
    this.programaService.eliminar(p.id!).subscribe({
      next: () => {
        this.mostrarExito('Programa académico eliminado');
        this.cargarDatos();
      },
      error: (err) => this.mostrarError(err.error?.mensaje || 'No se puede eliminar porque tiene materias o alumnos asociados')
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
