import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/layout/sidebar/sidebar.component';
import { MateriaService } from '../../services/materia.service';
import { Materia } from '../../../../shared/models/materia.model';

@Component({
  selector: 'app-gestion-materias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './gestion-materias.html'
})
export class GestionMaterias implements OnInit {
  private materiaService = inject(MateriaService);
  private fb = inject(FormBuilder);

  materias = signal<Materia[]>([]);
  cargando = signal<boolean>(false);
  modalAbierto = signal<boolean>(false);
  editandoId = signal<number | null>(null);

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    estado: [true]
  });

  ngOnInit(): void {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.cargando.set(true);
    this.materiaService.listar().subscribe({
      next: (data) => {
        const normalizadas = data.map(m => ({
          ...m,
          estado: m.estado ?? true
        }));
        this.materias.set(normalizadas);
        this.cargando.set(false);
      },
      error: () => {
        this.mostrarError('Error al cargar catálogo de materias');
        this.cargando.set(false);
      }
    });
  }

  abrirModalNuevo(): void {
    this.editandoId.set(null);
    this.form.reset({
      nombre: '',
      descripcion: '',
      estado: true
    });
    this.modalAbierto.set(true);
  }

  abrirModalEditar(m: Materia): void {
    this.editandoId.set(m.id!);
    this.form.patchValue({
      nombre: m.nombre,
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
      nombre: val.nombre!,
      descripcion: val.descripcion || '',
      estado: val.estado ?? true
    };

    if (this.editandoId()) {
      this.materiaService.actualizar(this.editandoId()!, payload).subscribe({
        next: () => {
          this.mostrarExito('Materia actualizada con éxito');
          this.cerrarModal();
          this.cargarMaterias();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al actualizar materia')
      });
    } else {
      this.materiaService.crear(payload).subscribe({
        next: () => {
          this.mostrarExito('Materia creada con éxito');
          this.cerrarModal();
          this.cargarMaterias();
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
        this.cargarMaterias();
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
