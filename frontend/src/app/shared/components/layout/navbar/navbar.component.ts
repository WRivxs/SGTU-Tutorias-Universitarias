import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Barra Principal -->
    <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 z-30 shrink-0">
      <!-- Lado Izquierdo: Boton Hamburguesa (Mobile) + Indicador Periodo -->
      <div class="flex items-center gap-3">
        <!-- Boton Menu Hamburguesa visible unicamente en pantallas moviles -->
        <button
          type="button"
          (click)="layoutService.toggleSidebar()"
          class="md:hidden p-2 rounded-lg text-[#051F20] hover:bg-[#DBF0DD]/50 active:bg-[#DBF0DD] transition-colors cursor-pointer flex items-center justify-center"
          aria-label="Abrir menu de navegacion">
          <span class="material-symbols-outlined text-2xl">menu</span>
        </button>

        <!-- Indicador de Periodo -->
        <div class="flex items-center gap-1.5 px-3 py-1 bg-[#DBF0DD] text-[#173831] rounded-full text-xs font-semibold">
          <span class="material-symbols-outlined text-sm">calendar_today</span>
          <span class="hidden xs:inline">Periodo Lectivo</span>
          <span>2026-2</span>
        </div>
        <div class="hidden sm:flex items-center gap-1 text-xs text-gray-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>

      <!-- Alerta Modo Supervision Admin si esta fuera de /admin -->
      @if (esAdminSupervisando()) {
        <div class="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <span class="material-symbols-outlined text-sm text-amber-600">visibility</span>
          <span>Modo Supervision: Rol {{ rolActualRuta() }}</span>
          <a routerLink="/admin/dashboard"
             class="ml-1 text-[11px] bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-0.5 rounded-full transition-colors cursor-pointer">
            Volver a Admin
          </a>
        </div>
      }

      <!-- Datos del Usuario Logueado & Perfil -->
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="flex flex-col text-right max-w-[130px] sm:max-w-none">
          <span class="text-xs font-bold text-[#051F20] truncate">
            {{ usuario()?.nombre }} {{ usuario()?.apellido }}
          </span>
          <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold truncate">
            {{ usuario()?.rol }}
          </span>
        </div>
        <div class="w-9 h-9 rounded-full bg-[#173831] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
          {{ iniciales() }}
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  public layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = this.authService.usuario;

  esAdminSupervisando = computed(() => {
    const rol = this.authService.rol();
    const url = this.router.url;
    return rol === 'ADMINISTRADOR' && !url.startsWith('/admin');
  });

  rolActualRuta = computed(() => {
    const url = this.router.url;
    if (url.startsWith('/tutor')) return 'Tutor / Docente';
    if (url.startsWith('/estudiante')) return 'Estudiante';
    return 'Usuario';
  });

  iniciales(): string {
    const u = this.usuario();
    if (!u) return 'U';
    const n = u.nombre ? u.nombre.charAt(0) : '';
    const a = u.apellido ? u.apellido.charAt(0) : '';
    return (n + a).toUpperCase() || 'U';
  }
}
