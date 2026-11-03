import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Contenedor flotante de notificaciones institucionales -->
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      @for (t of toastService.toasts(); track t.id) {
        <div
          class="pointer-events-auto bg-white rounded-xl shadow-xl border-l-4 p-4 flex items-start gap-3 transition-all transform animate-in slide-in-from-top-3 duration-200"
          [ngClass]="{
            'border-l-emerald-600 border-slate-300 border': t.tipo === 'exito',
            'border-l-red-600 border-slate-300 border': t.tipo === 'error',
            'border-l-amber-500 border-slate-300 border': t.tipo === 'advertencia',
            'border-l-cyan-600 border-slate-300 border': t.tipo === 'info'
          }">

          <!-- Icono segun tipo -->
          <div class="shrink-0 mt-0.5">
            @if (t.tipo === 'exito') {
              <span class="material-symbols-outlined text-emerald-600 text-xl" style="font-variation-settings: 'FILL' 1">check_circle</span>
            } @else if (t.tipo === 'error') {
              <span class="material-symbols-outlined text-red-600 text-xl" style="font-variation-settings: 'FILL' 1">cancel</span>
            } @else if (t.tipo === 'advertencia') {
              <span class="material-symbols-outlined text-amber-500 text-xl" style="font-variation-settings: 'FILL' 1">warning</span>
            } @else {
              <span class="material-symbols-outlined text-cyan-600 text-xl" style="font-variation-settings: 'FILL' 1">info</span>
            }
          </div>

          <!-- Mensaje -->
          <div class="flex-1 text-xs">
            @if (t.titulo) {
              <h4 class="font-bold text-slate-900 mb-0.5">{{ t.titulo }}</h4>
            }
            <p class="text-slate-600 leading-relaxed">{{ t.mensaje }}</p>
          </div>

          <!-- Boton Cerrar -->
          <button
            type="button"
            (click)="toastService.remover(t.id)"
            class="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition-colors shrink-0"
            aria-label="Cerrar notificación">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);
}
