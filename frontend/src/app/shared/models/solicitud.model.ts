import { Estudiante } from './estudiante.model';
import { Usuario } from './usuario.model';
import { Tutoria } from './tutoria.model';

export type EstadoSolicitud = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';

export interface Solicitud {
  id?: number;
  estudiante?: Estudiante & Partial<Usuario>;
  tutoria?: Tutoria;
  fechaSolicitud?: string;
  estado: EstadoSolicitud;
  comentario?: string;
}
