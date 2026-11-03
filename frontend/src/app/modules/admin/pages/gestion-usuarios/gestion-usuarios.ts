import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/layout/sidebar/sidebar.component';
import { UsuarioService } from '../../services/usuario.service';
import { DocenteService } from '../../../../core/services/docente.service';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { FacultadService } from '../../../../core/services/facultad.service';
import { ProgramaService } from '../../../../core/services/programa.service';
import { MateriaService } from '../../services/materia.service';

import { Usuario, RolUsuario } from '../../../../shared/models/usuario.model';
import { Docente } from '../../../../shared/models/docente.model';
import { Estudiante } from '../../../../shared/models/estudiante.model';
import { Facultad } from '../../../../shared/models/facultad.model';
import { Programa } from '../../../../shared/models/programa.model';
import { Materia } from '../../../../shared/models/materia.model';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './gestion-usuarios.html'
})
export class GestionUsuarios implements OnInit {
  private usuarioService = inject(UsuarioService);
  private docenteService = inject(DocenteService);
  private estudianteService = inject(EstudianteService);
  private facultadService = inject(FacultadService);
  private programaService = inject(ProgramaService);
  private materiaService = inject(MateriaService);
  private fb = inject(FormBuilder);

  usuarios = signal<Usuario[]>([]);
  usuariosFiltrados = signal<Usuario[]>([]);
  docentes = signal<Docente[]>([]);
  estudiantes = signal<Estudiante[]>([]);
  facultades = signal<Facultad[]>([]);
  programas = signal<Programa[]>([]);
  materias = signal<Materia[]>([]);

  cargando = signal<boolean>(false);
  modalAbierto = signal<boolean>(false);
  editandoId = signal<number | null>(null);
  mostrarPassword = signal<boolean>(false);

  // Materias seleccionadas para el docente (selección múltiple)
  materiasDocenteSeleccionadas = signal<number[]>([]);

  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  busqueda = signal<string>('');
  filtroRol = signal<string>('TODOS');
  filtroEstado = signal<string>('TODOS');

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    password: [''],
    telefono: [''],
    rol: ['ESTUDIANTE' as RolUsuario, [Validators.required]],
    estado: [true],
    // Campos específicos para DOCENTE
    especialidad: [''],
    disponibilidad: [''],
    // Campos específicos para ESTUDIANTE
    facultadId: [''],
    programaId: [''],
    semestreActual: [1],
    codigoEstudiantil: ['']
  });

  // Signal reactiva para la facultad seleccionada en el formulario de estudiante
  facultadSeleccionadaModal = signal<string>('');

  programasParaModal = computed(() => {
    const facId = this.facultadSeleccionadaModal();
    if (!facId) return [];
    return this.programas().filter(p => p.facultad?.id === Number(facId));
  });

  onFacultadChange(): void {
    const facId = this.form.get('facultadId')?.value || '';
    this.facultadSeleccionadaModal.set(facId);
    // Limpiar carrera seleccionada para que el usuario elija obligatoriamente una de la facultad elegida
    this.form.patchValue({ programaId: '' });
  }

  ngOnInit(): void {
    this.cargarDatos();

    // Sincronizar automáticamente la signal con cualquier cambio de facultad
    this.form.get('facultadId')?.valueChanges.subscribe(val => {
      this.facultadSeleccionadaModal.set(val ? String(val) : '');
    });
  }

  cargarDatos(): void {
    this.cargando.set(true);

    this.facultadService.listar().subscribe({ next: f => this.facultades.set(f) });
    this.programaService.listar().subscribe({ next: p => this.programas.set(p) });
    this.materiaService.listar().subscribe({ next: m => this.materias.set(m) });

    this.docenteService.listar().subscribe({ next: d => this.docentes.set(d) });
    this.estudianteService.listar().subscribe({ next: e => this.estudiantes.set(e) });

    this.usuarioService.listar().subscribe({
      next: (data) => {
        const normalizados = data.map(u => ({
          ...u,
          estado: u.estado ?? u.activo ?? true
        }));
        this.usuarios.set(normalizados);
        this.aplicarFiltros();
        this.cargando.set(false);
      },
      error: () => {
        this.mostrarError('Error al cargar la lista de usuarios');
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    let res = this.usuarios();
    const q = this.busqueda().toLowerCase().trim();
    if (q) {
      res = res.filter(u =>
        u.nombre.toLowerCase().includes(q) ||
        u.apellido.toLowerCase().includes(q) ||
        u.correo.toLowerCase().includes(q)
      );
    }
    if (this.filtroRol() !== 'TODOS') {
      res = res.filter(u => u.rol === this.filtroRol());
    }
    if (this.filtroEstado() !== 'TODOS') {
      const activo = this.filtroEstado() === 'ACTIVOS';
      res = res.filter(u => (u.estado ?? true) === activo);
    }
    this.usuariosFiltrados.set(res);
  }

  onBuscar(e: Event): void {
    this.busqueda.set((e.target as HTMLInputElement).value);
    this.aplicarFiltros();
  }

  onCambiarFiltroRol(e: Event): void {
    this.filtroRol.set((e.target as HTMLSelectElement).value);
    this.aplicarFiltros();
  }

  onCambiarFiltroEstado(e: Event): void {
    this.filtroEstado.set((e.target as HTMLSelectElement).value);
    this.aplicarFiltros();
  }

  toggleMateriaDocente(materiaId: number): void {
    const actuales = [...this.materiasDocenteSeleccionadas()];
    const idx = actuales.indexOf(materiaId);
    if (idx > -1) {
      actuales.splice(idx, 1);
    } else {
      actuales.push(materiaId);
    }
    this.materiasDocenteSeleccionadas.set(actuales);
  }

  estaMateriaSeleccionada(materiaId?: number): boolean {
    if (!materiaId) return false;
    return this.materiasDocenteSeleccionadas().includes(materiaId);
  }

  abrirModalNuevo(): void {
    this.editandoId.set(null);
    this.materiasDocenteSeleccionadas.set([]);

    const primeraFacultad = this.facultades().length > 0 ? String(this.facultades()[0].id) : '';
    this.facultadSeleccionadaModal.set(primeraFacultad);
    const progs = this.programas().filter(p => p.facultad?.id === Number(primeraFacultad));
    const primerPrograma = progs.length > 0 ? String(progs[0].id) : '';

    this.form.reset({
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      telefono: '',
      rol: 'ESTUDIANTE',
      estado: true,
      especialidad: '',
      disponibilidad: 'Lunes a Viernes',
      facultadId: primeraFacultad,
      programaId: primerPrograma,
      semestreActual: 1,
      codigoEstudiantil: ''
    });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.modalAbierto.set(true);
  }

  abrirModalEditar(u: Usuario): void {
    this.editandoId.set(u.id!);

    const perfilDocente = this.docentes().find(d => d.usuario?.id === u.id);
    const perfilEstudiante = this.estudiantes().find(e => e.usuario?.id === u.id);

    if (perfilDocente && perfilDocente.materias) {
      this.materiasDocenteSeleccionadas.set(perfilDocente.materias.map(m => m.id!));
    } else {
      this.materiasDocenteSeleccionadas.set([]);
    }

    const facId = perfilEstudiante?.programa?.facultad?.id ? String(perfilEstudiante.programa.facultad.id) : '';
    this.facultadSeleccionadaModal.set(facId);

    this.form.patchValue({
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      password: '',
      telefono: u.telefono || '',
      rol: u.rol,
      estado: u.estado ?? true,
      especialidad: perfilDocente?.especialidad || '',
      disponibilidad: perfilDocente?.disponibilidad || '',
      facultadId: facId,
      programaId: perfilEstudiante?.programa?.id ? String(perfilEstudiante.programa.id) : '',
      semestreActual: perfilEstudiante?.semestreActual || 1,
      codigoEstudiantil: perfilEstudiante?.codigoEstudiantil || ''
    });

    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.editandoId.set(null);
    this.materiasDocenteSeleccionadas.set([]);
  }

  guardarUsuario(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const esDocente = val.rol === 'DOCENTE' || val.rol === 'TUTOR';
    const esEstudiante = val.rol === 'ESTUDIANTE';

    const usuarioPayload: Usuario = {
      nombre: val.nombre!,
      apellido: val.apellido!,
      correo: val.correo!,
      telefono: val.telefono || '',
      rol: val.rol as any,
      estado: val.estado ?? true
    };
    if (val.password && val.password.trim().length > 0) {
      usuarioPayload.password = val.password.trim();
    }

    const idActual = this.editandoId();

    if (idActual) {
      this.usuarioService.actualizar(idActual, usuarioPayload).subscribe({
        next: () => {
          this.mostrarExito('Usuario actualizado con éxito');
          if (esDocente) this.sincronizarPerfilDocente(idActual);
          if (esEstudiante) this.sincronizarPerfilEstudiante(idActual);
          this.cerrarModal();
          this.cargarDatos();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al actualizar usuario')
      });
    } else {
      this.usuarioService.crear(usuarioPayload).subscribe({
        next: (usrCreado) => {
          this.mostrarExito('Usuario creado exitosamente');
          if (esDocente && usrCreado.id) this.sincronizarPerfilDocente(usrCreado.id);
          if (esEstudiante && usrCreado.id) this.sincronizarPerfilEstudiante(usrCreado.id);
          this.cerrarModal();
          this.cargarDatos();
        },
        error: (err) => this.mostrarError(err.error?.mensaje || 'Error al crear usuario')
      });
    }
  }

  private sincronizarPerfilDocente(usuarioId: number): void {
    const val = this.form.value;
    const existente = this.docentes().find(d => d.usuario?.id === usuarioId);
    const materiasIds = this.materiasDocenteSeleccionadas();

    if (existente && existente.id) {
      this.docenteService.actualizar(existente.id, {
        usuario: { id: usuarioId } as Usuario,
        especialidad: val.especialidad || 'Docencia Académica',
        disponibilidad: val.disponibilidad || 'Lunes a Viernes'
      }).subscribe({
        next: (doc) => {
          if (materiasIds.length > 0 && doc.id) {
            this.docenteService.asignarMaterias(doc.id, materiasIds).subscribe();
          }
        }
      });
    } else {
      this.docenteService.crear({
        usuario: { id: usuarioId } as Usuario,
        especialidad: val.especialidad || 'Docencia Académica',
        disponibilidad: val.disponibilidad || 'Lunes a Viernes'
      }).subscribe({
        next: (doc) => {
          if (materiasIds.length > 0 && doc.id) {
            this.docenteService.asignarMaterias(doc.id, materiasIds).subscribe();
          }
        }
      });
    }
  }

  private sincronizarPerfilEstudiante(usuarioId: number): void {
    const val = this.form.value;
    if (!val.programaId) return;

    const existente = this.estudiantes().find(e => e.usuario?.id === usuarioId);
    const cod = val.codigoEstudiantil?.trim() || `EST-${usuarioId}-${new Date().getFullYear()}`;

    if (existente && existente.id) {
      this.estudianteService.actualizar(existente.id, {
        usuario: { id: usuarioId } as Usuario,
        programa: { id: Number(val.programaId) } as Programa,
        semestreActual: Number(val.semestreActual || 1),
        codigoEstudiantil: cod
      }).subscribe();
    } else {
      this.estudianteService.crear({
        usuario: { id: usuarioId } as Usuario,
        programa: { id: Number(val.programaId) } as Programa,
        semestreActual: Number(val.semestreActual || 1),
        codigoEstudiantil: cod
      }).subscribe();
    }
  }

  obtenerDetalleRol(u: Usuario): string {
    if (u.rol === 'DOCENTE' || u.rol === 'TUTOR') {
      const doc = this.docentes().find(d => d.usuario?.id === u.id);
      const nroMaterias = doc?.materias ? doc.materias.length : 0;
      return `${doc?.especialidad || 'Docente'} · ${nroMaterias} asignaturas autorizadas`;
    }
    if (u.rol === 'ESTUDIANTE') {
      const est = this.estudiantes().find(e => e.usuario?.id === u.id);
      return `${est?.programa?.nombre || 'Sin Programa'} (Sem. ${est?.semestreActual || 1})`;
    }
    return 'Administrador del Sistema';
  }

  toggleEstado(u: Usuario): void {
    const nuevoEstado = !(u.estado ?? true);
    this.usuarioService.cambiarEstado(u.id!, nuevoEstado).subscribe({
      next: () => {
        this.mostrarExito(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} con éxito`);
        this.cargarDatos();
      },
      error: () => this.mostrarError('Error al cambiar estado del usuario')
    });
  }

  eliminarUsuario(u: Usuario): void {
    if (!confirm(`¿Eliminar a ${u.nombre} ${u.apellido}?`)) return;

    this.usuarioService.eliminar(u.id!).subscribe({
      next: () => {
        this.mostrarExito('Usuario eliminado exitosamente');
        this.cargarDatos();
      },
      error: () => this.mostrarError('Error al eliminar usuario')
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
