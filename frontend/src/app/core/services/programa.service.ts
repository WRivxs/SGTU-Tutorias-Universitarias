import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programa } from '../../shared/models/programa.model';

const API_URL = 'http://localhost:8080/api/programas';

@Injectable({ providedIn: 'root' })
export class ProgramaService {
  private http = inject(HttpClient);

  listar(facultadId?: number, estado?: boolean): Observable<Programa[]> {
    const params: any = {};
    if (facultadId) params.facultadId = facultadId;
    if (estado !== undefined) params.estado = estado;
    return this.http.get<Programa[]>(API_URL, { params });
  }

  obtenerPorId(id: number): Observable<Programa> {
    return this.http.get<Programa>(`${API_URL}/${id}`);
  }

  crear(programa: Programa): Observable<Programa> {
    return this.http.post<Programa>(API_URL, programa);
  }

  actualizar(id: number, programa: Programa): Observable<Programa> {
    return this.http.put<Programa>(`${API_URL}/${id}`, programa);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
