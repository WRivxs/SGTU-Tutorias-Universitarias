import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/usuarios';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);

  actualizar(id: number, datos: Record<string, unknown>): Observable<unknown> {
    return this.http.put(`${API_URL}/${id}`, datos);
  }
}
