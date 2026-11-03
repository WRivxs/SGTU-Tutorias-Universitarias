import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  /**
   * Estado reactivo de apertura del sidebar en dispositivos móviles / tablets (< 768px).
   */
  sidebarAbierto = signal<boolean>(false);

  toggleSidebar(): void {
    this.sidebarAbierto.update(v => !v);
  }

  cerrarSidebar(): void {
    this.sidebarAbierto.set(false);
  }

  abrirSidebar(): void {
    this.sidebarAbierto.set(true);
  }
}
