import { Materia } from './materia.model';

export type EstadoTutoria = 'DISPONIBLE' | 'OCUPADA' | 'CANCELADA' | 'FINALIZADA';
export type ModalidadTutoria = 'PRESENCIAL' | 'VIRTUAL';

export interface Tutoria {
  id?: number;
  fecha: string;      // Formato YYYY-MM-DD
  hora: string;       // Formato HH:mm:ss o HH:mm
  modalidad: ModalidadTutoria;
  lugar?: string;
  descripcion?: string;
  estado: EstadoTutoria;
  materia?: Materia;
  tutor?: {
    id?: number;
    usuario?: {
      nombre?: string;
      apellido?: string;
      correo?: string;
    };
    especialidad?: string;
  };
}
