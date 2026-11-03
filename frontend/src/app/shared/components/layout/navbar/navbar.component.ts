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
    <!-- Barra Principal con bordes definidos y contraste institucional -->
    <header class="h-16 bg-white border-b border-slate-300 flex items-center justify-between px-3 sm:px-6 z-30 shrink-0 shadow-xs">
      <!-- Lado Izquierdo: Boton Hamburguesa (Mobile) + Indicador Periodo -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Boton Menu Hamburguesa visible unicamente en pantallas moviles -->
        <button
          type="button"
          (click)="layoutService.toggleSidebar()"
          class="md:hidden p-2 rounded-lg text-[#051F20] hover:bg-[#DBF0DD]/60 active:bg-[#DBF0DD] transition-colors cursor-pointer flex items-center justify-center border border-slate-300"
          aria-label="Abrir menu de navegacion">
          <span class="material-symbols-outlined text-2xl">menu</span>
        </button>

        <!-- Indicador de Periodo -->
        <div class="flex items-center gap-1.5 px-3 py-1 bg-[#DBF0DD] text-[#173831] border border-[#8CB79B]/50 rounded-full text-xs font-semibold">
          <span class="material-symbols-outlined text-sm">calendar_today</span>
          <span class="hidden xs:inline">Periodo</span>
          <span>2026-2</span>
        </div>
        <div class="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>

      <!-- Alerta Modo Supervision Admin si esta fuera de /admin -->
      @if (esAdminSupervisando()) {
        <div class="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs">
          <span class="material-symbols-outlined text-sm text-amber-600">visibility</span>
          <span>Supervision: {{ rolActualRuta() }}</span>
          <a routerLink="/admin/dashboard"
             class="ml-1 text-[11px] bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-0.5 rounded-full transition-colors cursor-pointer font-bold">
            Volver
          </a>
        </div>
      }

      <!-- Datos del Usuario Logueado: Clic en avatar/nombre lleva directo a la pagina de Perfil -->
      <a
        [routerLink]="rutaPerfil()"
        class="group flex items-center gap-2 sm:gap-3 p-1 sm:px-2.5 py-1.5 rounded-xl hover:bg-slate-100/90 active:bg-slate-200 border border-transparent hover:border-slate-300 transition-all cursor-pointer"
        title="Ver mi perfil institucional">
        <div class="flex flex-col text-right max-w-[120px] sm:max-w-none">
          <span class="text-xs font-bold text-[#051F20] group-hover:text-[#173831] truncate transition-colors">
            {{ usuario()?.nombre }} {{ usuario()?.apellido }}
          </span>
          <span class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate">
            {{ usuario()?.rol }}
          </span>
        </div>

        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#173831] group-hover:bg-[#235347] group-hover:ring-2 group-hover:ring-[#8CB79B] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 transition-all">
          {{ iniciales() }}
        </div>
      </a>
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

  rutaPerfil = computed(() => {
    const rol = this.authService.rol();
    if (rol === 'ESTUDIANTE') return '/estudiante/perfil';
    if (rol === 'DOCENTE' || rol === 'TUTOR') return '/tutor/perfil';
    return '/admin/dashboard';
  });

  iniciales(): string {
    const u = this.usuario();
    if (!u) return 'U';
    const n = u.nombre ? u.nombre.charAt(0) : '';
    const a = u.apellido ? u.apellido.charAt(0) : '';
    return (n + a).toUpperCase() || 'U';
  }
}
