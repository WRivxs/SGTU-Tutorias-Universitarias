import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facultad } from '../../shared/models/facultad.model';

const API_URL = 'http://localhost:8080/api/facultades';

@Injectable({ providedIn: 'root' })
export class FacultadService {
  private http = inject(HttpClient);

  listar(estado?: boolean): Observable<Facultad[]> {
    const params: any = {};
    if (estado !== undefined) params.estado = estado;
    return this.http.get<Facultad[]>(API_URL, { params });
  }

  obtenerPorId(id: number): Observable<Facultad> {
    return this.http.get<Facultad>(`${API_URL}/${id}`);
  }

  crear(facultad: Facultad): Observable<Facultad> {
    return this.http.post<Facultad>(API_URL, facultad);
  }

  actualizar(id: number, facultad: Facultad): Observable<Facultad> {
    return this.http.put<Facultad>(`${API_URL}/${id}`, facultad);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
