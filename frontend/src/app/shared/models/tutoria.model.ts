import { Materia } from './materia.model';
import { Docente } from './docente.model';

export type EstadoTutoria = 'DISPONIBLE' | 'OCUPADA' | 'CANCELADA' | 'FINALIZADA';
export type ModalidadTutoria = 'PRESENCIAL' | 'VIRTUAL';

export interface Tutoria {
  id?: number;
  fecha: string;      // Formato YYYY-MM-DD
  hora: string;       // Formato HH:mm:ss o HH:mm
  cupoMaximo?: number;
  modalidad: ModalidadTutoria;
  lugar?: string;
  descripcion?: string;
  estado: EstadoTutoria;
  materia?: Materia;
  docente?: Docente;
  tutor?: Docente; // Alias para compatibilidad con vistas previas
}
