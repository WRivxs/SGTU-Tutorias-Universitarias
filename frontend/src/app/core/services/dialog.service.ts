import { Injectable, signal } from '@angular/core';

export interface DialogOpciones {
  titulo: string;
  mensaje: string;
  textoBotonConfirmar?: string;
  textoBtnConfirmar?: string;
  textoBotonCancelar?: string;
  textoBtnCancelar?: string;
  tipo?: 'peligro' | 'info' | 'advertencia' | 'confirmar' | string;
  accion?: () => void;
  onConfirmar?: () => void;
  onCancelar?: () => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  dialogActivo = signal<DialogOpciones | null>(null);

  confirmar(opciones: DialogOpciones): void {
    this.dialogActivo.set(opciones);
  }

  ejecutarConfirmar(): void {
    const dialog = this.dialogActivo();
    if (dialog) {
      if (dialog.accion) dialog.accion();
      if (dialog.onConfirmar) dialog.onConfirmar();
    }
    this.dialogActivo.set(null);
  }

  ejecutarCancelar(): void {
    const dialog = this.dialogActivo();
    if (dialog && dialog.onCancelar) {
      dialog.onCancelar();
    }
    this.dialogActivo.set(null);
  }
}
