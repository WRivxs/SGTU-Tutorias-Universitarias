import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  tipo: 'exito' | 'error' | 'info' | 'advertencia';
  titulo?: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  mostrar(mensaje: string, tipo: 'exito' | 'error' | 'info' | 'advertencia' = 'info', titulo?: string, duracionMs: number = 3800): void {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const toast: Toast = { id, tipo, titulo, mensaje };

    this.toasts.update(lista => [...lista, toast]);

    if (duracionMs > 0) {
      setTimeout(() => {
        this.remover(id);
      }, duracionMs);
    }
  }

  exito(mensaje: string, titulo: string = 'Éxito'): void {
    this.mostrar(mensaje, 'exito', titulo, 3800);
  }

  error(mensaje: string, titulo: string = 'Error'): void {
    this.mostrar(mensaje, 'error', titulo, 4500);
  }

  info(mensaje: string, titulo: string = 'Información'): void {
    this.mostrar(mensaje, 'info', titulo, 3800);
  }

  advertencia(mensaje: string, titulo: string = 'Atención'): void {
    this.mostrar(mensaje, 'advertencia', titulo, 4000);
  }

  remover(id: string): void {
    this.toasts.update(lista => lista.filter(t => t.id !== id));
  }
}
