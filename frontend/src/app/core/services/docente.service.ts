import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Docente } from '../../shared/models/docente.model';

const API_URL = 'http://localhost:8080/api/docentes';

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private http = inject(HttpClient);

  listar(): Observable<Docente[]> {
    return this.http.get<Docente[]>(API_URL);
  }

  obtenerPorId(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${API_URL}/${id}`);
  }

  obtenerPorUsuarioId(usuarioId: number): Observable<Docente> {
    return this.http.get<Docente>(`${API_URL}/usuario/${usuarioId}`);
  }

  crear(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(API_URL, docente);
  }

  actualizar(id: number, docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(`${API_URL}/${id}`, docente);
  }

  asignarMaterias(id: number, materiasIds: number[]): Observable<Docente> {
    return this.http.put<Docente>(`${API_URL}/${id}/materias`, materiasIds);
  }

  removerMateria(id: number, materiaId: number): Observable<Docente> {
    return this.http.delete<Docente>(`${API_URL}/${id}/materias/${materiaId}`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
