import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 1. Banner Flotante de Instalación PWA (Android / Chrome / Desktop) -->
    @if (pwaService.mostrarBanner() && !pwaService.mostrarGuiaIos()) {
      <div class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
        <div class="bg-white rounded-2xl shadow-2xl border-2 border-[#173831] p-4 flex items-start gap-3.5 relative overflow-hidden">
          <!-- Franja decorativa institucional -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#051F20] via-[#173831] to-[#8CB79B]"></div>

          <!-- Logo Institucional -->
          <div class="w-12 h-12 rounded-xl bg-[#051F20] border border-[#8CB79B]/50 flex items-center justify-center shrink-0 shadow-md">
            <span class="material-symbols-outlined text-2xl text-[#DBF0DD]" style="font-variation-settings: 'FILL' 1">school</span>
          </div>

          <!-- Contenido y Acciones -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-sm text-[#051F20] flex items-center gap-1.5">
                <span>Instalar App SGTU</span>
                <span class="px-1.5 py-0.2 bg-[#DBF0DD] text-[#173831] text-[9px] font-extrabold rounded-sm uppercase tracking-wider">PWA</span>
              </h4>
              <button
                type="button"
                (click)="pwaService.cerrarBanner()"
                class="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition-colors"
                aria-label="Cerrar">
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p class="text-xs text-slate-600 mt-1 leading-snug">
              Instala la plataforma en tu teléfono para entrar con 1 toque y usarla como una aplicación nativa.
            </p>

            <div class="mt-3 flex items-center gap-2">
              <button
                type="button"
                (click)="pwaService.solicitarInstalacion()"
                class="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#173831] hover:bg-[#235347] active:bg-[#051F20] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer">
                <span class="material-symbols-outlined text-base">download_for_offline</span>
                <span>Instalar Aplicación</span>
              </button>

              <button
                type="button"
                (click)="pwaService.cerrarBanner()"
                class="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                Ahora no
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- 2. Modal Guía Paso a Paso para iPhone / iPad (iOS Safari) -->
    @if (pwaService.mostrarGuiaIos()) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-white rounded-3xl sm:rounded-2xl shadow-2xl border border-slate-300 w-full max-w-sm p-6 text-center animate-in slide-in-from-bottom-6 duration-300">
          <div class="w-14 h-14 rounded-2xl bg-[#051F20] text-[#DBF0DD] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1">school</span>
          </div>

          <h3 class="font-bold text-base text-[#051F20]">Instalar SGTU en iPhone</h3>
          <p class="text-xs text-slate-600 mt-1.5 mb-5 leading-relaxed">
            Sigue estos dos sencillos pasos en tu navegador Safari para tener la app en tu pantalla de inicio:
          </p>

          <div class="space-y-3 text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-[#173831] text-white flex items-center justify-center font-bold text-[11px] shrink-0">1</div>
              <p class="text-slate-700">Toca el botón <strong>Compartir</strong> en la barra inferior de Safari (<span class="material-symbols-outlined text-base align-middle text-[#173831]">ios_share</span>).</p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-[#173831] text-white flex items-center justify-center font-bold text-[11px] shrink-0">2</div>
              <p class="text-slate-700">Desliza y selecciona <strong>"Agregar a pantalla de inicio"</strong> (<span class="material-symbols-outlined text-base align-middle text-[#173831]">add_box</span>).</p>
            </div>
          </div>

          <button
            type="button"
            (click)="pwaService.mostrarGuiaIos.set(false); pwaService.cerrarBanner()"
            class="w-full py-2.5 bg-[#173831] hover:bg-[#235347] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm">
            ¡Entendido!
          </button>
        </div>
      </div>
    }
  `
})
export class PwaInstallPromptComponent {
  public pwaService = inject(PwaService);
}
