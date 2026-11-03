import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Fondo oscuro traslucido en moviles al abrir menu -->
    @if (layoutService.sidebarAbierto()) {
      <div
        (click)="layoutService.cerrarSidebar()"
        class="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300">
      </div>
    }

    <!-- Sidebar con altura dinamica y bordes limpios -->
    <aside
      [class.-translate-x-full]="!layoutService.sidebarAbierto()"
      class="w-64 h-[100dvh] max-h-[100dvh] bg-[#051F20] text-white flex flex-col justify-between flex-shrink-0 select-none
             fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
             md:static md:translate-x-0 md:z-auto border-r border-[#173831]/80">

      <!-- Cabecera y Enlaces con scroll interno -->
      <div class="flex-1 overflow-y-auto min-h-0 flex flex-col">
        <!-- Marca SGTU -->
        <div class="h-16 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-[#173831] flex items-center justify-center text-[#8CB79B] shadow-inner">
              <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1">school</span>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-sm tracking-tight text-white">SGTU Admin</span>
              <span class="text-[10px] text-[#8CB79B] uppercase tracking-wider font-semibold">Portal Central</span>
            </div>
          </div>

          <!-- Boton X para cerrar en moviles -->
          <button
            type="button"
            (click)="layoutService.cerrarSidebar()"
            class="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar menu">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Menu Principal -->
        <div class="px-3 py-4">
          <div class="px-3 pb-2 text-[10px] uppercase tracking-wider text-[#8CB79B] font-semibold">
            Menu Principal
          </div>
          <nav class="flex flex-col gap-1">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-[#173831] text-white font-semibold shadow-xs"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">grid_view</span>
              <span>Dashboard</span>
            </a>

            <a routerLink="/admin/usuarios" routerLinkActive="bg-[#173831] text-white font-semibold shadow-xs"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">group</span>
              <span>Gestion de Usuarios</span>
            </a>

            <a routerLink="/admin/facultades-programas" routerLinkActive="bg-[#173831] text-white font-semibold shadow-xs"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">domain</span>
              <span>Facultades y Carreras</span>
            </a>

            <a routerLink="/admin/materias" routerLinkActive="bg-[#173831] text-white font-semibold shadow-xs"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">menu_book</span>
              <span>Gestion de Materias</span>
            </a>

            <a routerLink="/admin/calendario" routerLinkActive="bg-[#173831] text-white font-semibold shadow-xs"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">calendar_month</span>
              <span>Calendario de Tutorias</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Pie del Sidebar: Cerrar Sesion elegante, sutil y estilizado -->
      <div class="p-3 pb-8 md:pb-4 border-t border-white/10 shrink-0">
        <button
          type="button"
          (click)="logout()"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-red-300 hover:text-white hover:bg-red-500/20 active:bg-red-500/30 transition-all cursor-pointer font-medium">
          <span class="material-symbols-outlined text-lg text-red-400">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  public layoutService = inject(LayoutService);
  private authService = inject(AuthService);

  logout(): void {
    this.layoutService.cerrarSidebar();
    this.authService.logout();
  }
}
