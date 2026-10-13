import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TutorPerfil {
  id?: number;
  usuario: {
    id: number;
    nombre?: string;
    apellido?: string;
    correo?: string;
  };
  especialidad?: string;
  descripcion?: string;
  disponibilidad?: string;
}

const API_URL = 'http://localhost:8080/api/tutores';

@Injectable({ providedIn: 'root' })
export class TutorPerfilService {
  private http = inject(HttpClient);

  listar(): Observable<TutorPerfil[]> {
    return this.http.get<TutorPerfil[]>(API_URL);
  }

  obtenerPorId(id: number): Observable<TutorPerfil> {
    return this.http.get<TutorPerfil>(`${API_URL}/${id}`);
  }

  obtenerPorUsuarioId(usuarioId: number): Observable<TutorPerfil> {
    return this.http.get<TutorPerfil>(`${API_URL}/usuario/${usuarioId}`);
  }

  crear(tutor: TutorPerfil): Observable<TutorPerfil> {
    return this.http.post<TutorPerfil>(API_URL, tutor);
  }

  actualizar(id: number, tutor: TutorPerfil): Observable<TutorPerfil> {
    return this.http.put<TutorPerfil>(`${API_URL}/${id}`, tutor);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
