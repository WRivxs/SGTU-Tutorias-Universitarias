import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, UsuarioSesion } from '../../shared/models/auth.model';

const API_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'sgtu_token';
const USER_KEY = 'sgtu_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _usuario = signal<UsuarioSesion | null>(this.cargarUsuario());

  readonly usuario = this._usuario.asReadonly();
  readonly isAuthenticated = computed(() => this._usuario() !== null);
  readonly rol = computed(() => this._usuario()?.rol ?? null);

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, request).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        const user: UsuarioSesion = {
          id: res.id,
          nombre: res.nombre,
          apellido: res.apellido,
          correo: res.correo,
          rol: res.rol
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this._usuario.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private cargarUsuario(): UsuarioSesion | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  redirigirPorRol(): void {
    const rol = this._usuario()?.rol;
    if (rol === 'ADMINISTRADOR') this.router.navigate(['/admin/dashboard']);
    else if (rol === 'TUTOR') this.router.navigate(['/tutor/mis-tutorias']);
    else if (rol === 'ESTUDIANTE') this.router.navigate(['/estudiante/buscar-tutorias']);
    else this.router.navigate(['/login']);
  }
}
