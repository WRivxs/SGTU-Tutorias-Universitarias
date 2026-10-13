import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../../shared/models/solicitud.model';

const API_URL = 'http://localhost:8080/api/solicitudes';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private http = inject(HttpClient);

  listar(estudianteId?: number, tutoriaId?: number): Observable<Solicitud[]> {
    let url = API_URL;
    const params: string[] = [];
    if (estudianteId) params.push(`estudianteId=${estudianteId}`);
    if (tutoriaId) params.push(`tutoriaId=${tutoriaId}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get<Solicitud[]>(url);
  }

  obtenerPorId(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${API_URL}/${id}`);
  }

  crear(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(API_URL, solicitud);
  }

  responder(id: number, estado: string, comentario?: string): Observable<Solicitud> {
    let url = `${API_URL}/${id}/responder?estado=${estado}`;
    if (comentario) {
      url += `&comentario=${encodeURIComponent(comentario)}`;
    }
    return this.http.patch<Solicitud>(url, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
