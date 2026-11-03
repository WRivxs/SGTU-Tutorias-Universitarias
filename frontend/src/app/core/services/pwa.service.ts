import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaService {
  deferredPrompt = signal<any>(null);
  mostrarBanner = signal<boolean>(false);
  mostrarGuiaIos = signal<boolean>(false);
  estaInstalada = signal<boolean>(false);

  constructor() {
    this.inicializar();
  }

  private inicializar(): void {
    if (typeof window === 'undefined') return;

    // Detectar si ya corre como app instalada (standalone)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    this.estaInstalada.set(standalone);

    if (standalone) return;

    // Escuchar evento nativo de instalación
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt.set(e);
      setTimeout(() => {
        this.mostrarBanner.set(true);
      }, 1500);
    });

    // Detectar iOS Safari
    const esIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (esIos && !standalone) {
      setTimeout(() => {
        this.mostrarBanner.set(true);
      }, 2000);
    }
  }

  solicitarInstalacion(): void {
    const esIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (esIos) {
      this.mostrarGuiaIos.set(true);
      return;
    }

    const prompt = this.deferredPrompt();
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] El usuario instaló la aplicación');
          this.estaInstalada.set(true);
        }
        this.deferredPrompt.set(null);
        this.mostrarBanner.set(false);
      });
    } else {
      alert('Para instalar la app, abre el menú de opciones de tu navegador (⋮) y selecciona "Instalar aplicación" o "Agregar a pantalla principal".');
      this.mostrarBanner.set(false);
    }
  }

  cerrarBanner(): void {
    this.mostrarBanner.set(false);
  }
}
