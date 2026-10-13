import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutoria } from '../../shared/models/tutoria.model';

const API_URL = 'http://localhost:8080/api/tutorias';

@Injectable({ providedIn: 'root' })
export class TutoriaService {
  private http = inject(HttpClient);

  listar(): Observable<Tutoria[]> {
    return this.http.get<Tutoria[]>(API_URL);
  }

  obtenerPorId(id: number): Observable<Tutoria> {
    return this.http.get<Tutoria>(`${API_URL}/${id}`);
  }

  crear(tutoria: Tutoria): Observable<Tutoria> {
    return this.http.post<Tutoria>(API_URL, tutoria);
  }

  actualizar(id: number, tutoria: Tutoria): Observable<Tutoria> {
    return this.http.put<Tutoria>(`${API_URL}/${id}`, tutoria);
  }

  cambiarEstado(id: number, estado: string): Observable<Tutoria> {
    return this.http.patch<Tutoria>(`${API_URL}/${id}/estado?estado=${estado}`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
