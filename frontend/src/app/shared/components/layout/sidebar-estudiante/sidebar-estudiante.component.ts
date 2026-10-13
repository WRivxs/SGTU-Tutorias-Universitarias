import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-estudiante',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 h-screen bg-[#051F20] text-white flex flex-col justify-between flex-shrink-0 select-none">
      <!-- Logo y Rol -->
      <div>
        <div class="h-16 px-6 flex items-center gap-3 border-b border-white/5">
          <div class="w-9 h-9 rounded-lg bg-[#173831] flex items-center justify-center text-[#8CB79B]">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1">school</span>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-sm tracking-tight text-white">SGTU Alumno</span>
            <span class="text-[10px] text-[#8CB79B] uppercase tracking-wider font-semibold">Portal Estudiante</span>
          </div>
        </div>

        <!-- Menú del Estudiante -->
        <div class="px-3 py-4">
          <div class="px-3 pb-2 text-[10px] uppercase tracking-wider text-[#8CB79B] font-semibold">
            Mi Aprendizaje
          </div>
          <nav class="flex flex-col gap-1">
            <a routerLink="/estudiante/buscar-tutorias" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">search</span>
              <span>Buscar Tutorías</span>
            </a>

            <a routerLink="/estudiante/mis-solicitudes" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">assignment</span>
              <span>Mis Solicitudes</span>
            </a>

            <a routerLink="/estudiante/horario" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">calendar_month</span>
              <span>Mi Horario</span>
            </a>

            <a routerLink="/estudiante/perfil" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">account_circle</span>
              <span>Mi Perfil</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Pie: Cerrar Sesión -->
      <div class="p-3 border-t border-white/5">
        <button (click)="logout()"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-lg">logout</span>
          <span class="font-semibold">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarEstudianteComponent {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
