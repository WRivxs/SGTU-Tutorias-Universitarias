import { Programa } from './programa.model';

/**
 * Modelo de Materia / Asignatura
 * Actualizado según corrección del docente:
 * - Pertenece a un Programa Académico
 * - Ubicada en la Malla Curricular por Semestre (1 al 10)
 * - Código institucional y créditos académicos
 */
export interface Materia {
  id?: number;
  programa?: Programa;
  nombre: string;
  codigo: string;
  semestre: number;
  creditos?: number;
  descripcion?: string;
  estado?: boolean;
}
