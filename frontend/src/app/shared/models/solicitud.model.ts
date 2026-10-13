import { Usuario } from './usuario.model';
import { Tutoria } from './tutoria.model';

export type EstadoSolicitud = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';

export interface Solicitud {
  id?: number;
  estudiante?: Usuario;
  tutoria?: Tutoria;
  fechaSolicitud?: string;
  estado: EstadoSolicitud;
  comentario?: string;
}
