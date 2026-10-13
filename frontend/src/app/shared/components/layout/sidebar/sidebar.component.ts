import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 h-screen bg-[#051F20] text-white flex flex-col justify-between flex-shrink-0 select-none">
      <div>
        <!-- Marca SGTU -->
        <div class="h-16 px-6 flex items-center gap-3 border-b border-white/5">
          <div class="w-9 h-9 rounded-lg bg-[#173831] flex items-center justify-center text-[#8CB79B]">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1">school</span>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-sm tracking-tight text-white">SGTU Admin</span>
            <span class="text-[10px] text-[#8CB79B] uppercase tracking-wider font-semibold">Portal Central</span>
          </div>
        </div>

        <!-- Menú Principal -->
        <div class="px-3 py-4">
          <div class="px-3 pb-2 text-[10px] uppercase tracking-wider text-[#8CB79B] font-semibold">
            Menú Principal
          </div>
          <nav class="flex flex-col gap-1">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">grid_view</span>
              <span>Dashboard</span>
            </a>

            <a routerLink="/admin/usuarios" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">group</span>
              <span>Gestión de Usuarios</span>
            </a>

            <a routerLink="/admin/materias" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">menu_book</span>
              <span>Gestión de Materias</span>
            </a>

            <a routerLink="/admin/calendario" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">calendar_month</span>
              <span>Calendario de Tutorías</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Pie del Sidebar: Cerrar Sesión -->
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
export class SidebarComponent {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
