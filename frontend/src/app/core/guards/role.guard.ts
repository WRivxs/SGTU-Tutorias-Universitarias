import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (roles: string[]): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolUsuario = authService.rol();
  // El ADMINISTRADOR tiene acceso jerárquico total a cualquier módulo
  if (rolUsuario === 'ADMINISTRADOR' || (rolUsuario && roles.includes(rolUsuario))) {
    return true;
  }
  // Redirigir según rol actual si está logueado
  if (authService.isAuthenticated()) {
    authService.redirigirPorRol();
    return false;
  }
  return router.createUrlTree(['/login']);
};
