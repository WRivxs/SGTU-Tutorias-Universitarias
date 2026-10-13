import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth — público
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/pages/login/login').then(m => m.Login)
  },

  // Admin
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMINISTRADOR'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/admin/pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./modules/admin/pages/gestion-usuarios/gestion-usuarios').then(m => m.GestionUsuarios)
      },
      {
        path: 'materias',
        loadComponent: () => import('./modules/admin/pages/gestion-materias/gestion-materias').then(m => m.GestionMaterias)
      },
      {
        path: 'calendario',
        loadComponent: () => import('./modules/admin/pages/calendario-tutorias/calendario-tutorias').then(m => m.CalendarioTutorias)
      }
    ]
  },

  // Tutor
  {
    path: 'tutor',
    canActivate: [authGuard, roleGuard(['TUTOR'])],
    children: [
      { path: '', redirectTo: 'mis-tutorias', pathMatch: 'full' },
      {
        path: 'mis-tutorias',
        loadComponent: () => import('./modules/tutor/pages/mis-tutorias/mis-tutorias').then(m => m.MisTutorias)
      },
      {
        path: 'agenda',
        loadComponent: () => import('./modules/tutor/pages/agenda/agenda').then(m => m.Agenda)
      },
      {
        path: 'solicitudes',
        loadComponent: () => import('./modules/tutor/pages/solicitudes/solicitudes').then(m => m.Solicitudes)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./modules/tutor/pages/perfil/perfil').then(m => m.PerfilTutor)
      }
    ]
  },

  // Estudiante
  {
    path: 'estudiante',
    canActivate: [authGuard, roleGuard(['ESTUDIANTE'])],
    children: [
      { path: '', redirectTo: 'buscar-tutorias', pathMatch: 'full' },
      {
        path: 'buscar-tutorias',
        loadComponent: () => import('./modules/estudiante/pages/buscar-tutorias/buscar-tutorias').then(m => m.BuscarTutorias)
      },
      {
        path: 'mis-solicitudes',
        loadComponent: () => import('./modules/estudiante/pages/mis-solicitudes/mis-solicitudes').then(m => m.MisSolicitudes)
      },
      {
        path: 'horario',
        loadComponent: () => import('./modules/estudiante/pages/horario/horario').then(m => m.HorarioEstudiante)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./modules/estudiante/pages/perfil/perfil').then(m => m.PerfilEstudiante)
      }
    ]
  },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];
