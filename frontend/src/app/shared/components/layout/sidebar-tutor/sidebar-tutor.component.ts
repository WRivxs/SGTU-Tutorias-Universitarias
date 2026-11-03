import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'app-sidebar-tutor',
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

    <!-- Sidebar deslizable en movil con altura dinamica (100dvh) para evitar solapamiento -->
    <aside
      [class.-translate-x-full]="!layoutService.sidebarAbierto()"
      class="w-64 h-[100dvh] max-h-[100dvh] bg-[#051F20] text-white flex flex-col justify-between flex-shrink-0 select-none
             fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
             md:static md:translate-x-0 md:z-auto">

      <!-- Logo y Rol con scroll interno si es necesario -->
      <div class="flex-1 overflow-y-auto min-h-0 flex flex-col">
        <div class="h-16 px-6 flex items-center justify-between border-b border-white/5 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-[#173831] flex items-center justify-center text-[#8CB79B]">
              <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1">co_present</span>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-sm tracking-tight text-white">SGTU Docente</span>
              <span class="text-[10px] text-[#8CB79B] uppercase tracking-wider font-semibold">Portal Tutor</span>
            </div>
          </div>

          <!-- Boton X para cerrar en movil -->
          <button
            type="button"
            (click)="layoutService.cerrarSidebar()"
            class="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar menu">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Menu del Tutor -->
        <div class="px-3 py-4">
          <div class="px-3 pb-2 text-[10px] uppercase tracking-wider text-[#8CB79B] font-semibold">
            Mi Gestion Academica
          </div>
          <nav class="flex flex-col gap-1">
            <a routerLink="/tutor/mis-tutorias" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">event_available</span>
              <span>Mis Tutorias</span>
            </a>

            <a routerLink="/tutor/agenda" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">calendar_month</span>
              <span>Mi Calendario</span>
            </a>

            <a routerLink="/tutor/solicitudes" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">inbox</span>
              <span>Solicitudes Recibidas</span>
            </a>

            <a routerLink="/tutor/perfil" routerLinkActive="bg-[#173831] text-white font-semibold shadow-sm"
               (click)="layoutService.cerrarSidebar()"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#DBF0DD] hover:bg-[#173831] hover:text-white transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-lg">account_circle</span>
              <span>Mi Perfil Docente</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Pie del Sidebar: Cerrar Sesion con padding inferior seguro para celulares (pb-8 md:pb-3) -->
      <div class="p-3 pb-8 md:pb-3 border-t border-white/10 shrink-0 bg-[#051F20]">
        <button (click)="logout()"
          class="w-full flex items-center justify-center sm:justify-start gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-red-200 bg-red-950/60 hover:bg-red-900/80 border border-red-500/20 transition-colors cursor-pointer shadow-sm">
          <span class="material-symbols-outlined text-lg">logout</span>
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarTutorComponent {
  public layoutService = inject(LayoutService);
  private authService = inject(AuthService);

  logout(): void {
    this.layoutService.cerrarSidebar();
    this.authService.logout();
  }
}
