import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (dialogService.dialogActivo(); as d) {
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">

          <!-- Encabezado con Icono y Titulo -->
          <div class="p-6 pb-4 flex items-start gap-3.5">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              [ngClass]="{
                'bg-red-50 text-red-600 border border-red-200': d.tipo === 'peligro',
                'bg-amber-50 text-amber-600 border border-amber-200': d.tipo === 'advertencia',
                'bg-emerald-50 text-emerald-700 border border-emerald-200': d.tipo === 'confirmar' || d.tipo === 'info' || !d.tipo
              }">
              @if (d.tipo === 'peligro') {
                <span class="material-symbols-outlined text-xl">delete_forever</span>
              } @else if (d.tipo === 'advertencia') {
                <span class="material-symbols-outlined text-xl">warning</span>
              } @else {
                <span class="material-symbols-outlined text-xl">help</span>
              }
            </div>

            <div class="flex-1">
              <h3 class="text-base font-bold text-[#051F20]">{{ d.titulo }}</h3>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">{{ d.mensaje }}</p>
            </div>
          </div>

          <!-- Botones de Accion -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              (click)="dialogService.ejecutarCancelar()"
              class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer">
              {{ d.textoBtnCancelar || d.textoBotonCancelar || 'Cancelar' }}
            </button>

            <button
              type="button"
              (click)="dialogService.ejecutarConfirmar()"
              [ngClass]="{
                'bg-red-600 hover:bg-red-700 text-white': d.tipo === 'peligro',
                'bg-amber-600 hover:bg-amber-700 text-white': d.tipo === 'advertencia',
                'bg-[#173831] hover:bg-[#235347] text-white': d.tipo === 'confirmar' || d.tipo === 'info' || !d.tipo
              }"
              class="px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer">
              {{ d.textoBtnConfirmar || d.textoBotonConfirmar || (d.tipo === 'peligro' ? 'Eliminar' : 'Confirmar') }}
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  public dialogService = inject(DialogService);
}
