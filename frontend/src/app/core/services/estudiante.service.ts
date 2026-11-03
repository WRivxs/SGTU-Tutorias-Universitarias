import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../../shared/models/estudiante.model';

const API_URL = 'https://sgtu-tutorias-universitarias.onrender.com/api/estudiantes';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private http = inject(HttpClient);

  listar(programaId?: number): Observable<Estudiante[]> {
    const params: any = {};
    if (programaId) params.programaId = programaId;
    return this.http.get<Estudiante[]>(API_URL, { params });
  }

  obtenerPorId(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${API_URL}/${id}`);
  }

  obtenerPorUsuarioId(usuarioId: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${API_URL}/usuario/${usuarioId}`);
  }

  crear(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(API_URL, estudiante);
  }

  actualizar(id: number, estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${API_URL}/${id}`, estudiante);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
