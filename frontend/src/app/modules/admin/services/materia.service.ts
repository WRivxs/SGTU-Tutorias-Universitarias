import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia } from '../../../shared/models/materia.model';

const API_URL = 'http://localhost:8080/api/materias';

@Injectable({ providedIn: 'root' })
export class MateriaService {
  private http = inject(HttpClient);

  listar(estado?: boolean, programaId?: number, semestre?: number): Observable<Materia[]> {
    const params: any = {};
    if (estado !== undefined) params.estado = estado;
    if (programaId) params.programaId = programaId;
    if (semestre) params.semestre = semestre;
    return this.http.get<Materia[]>(API_URL, { params });
  }

  obtenerPorId(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${API_URL}/${id}`);
  }

  crear(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(API_URL, materia);
  }

  actualizar(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${API_URL}/${id}`, materia);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
