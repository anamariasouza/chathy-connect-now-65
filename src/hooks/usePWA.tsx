
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('PWA: beforeinstallprompt event fired');
      // Previne o prompt automático
      e.preventDefault();
      // Salva o evento para usar depois
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App foi instalada');
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Verifica se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      console.log('PWA: App já está instalado');
      setIsInstallable(false);
    } else {
      // Para iOS Safari, sempre mostra como instalável se não estiver em standalone
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        setIsInstallable(true);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async (): Promise<boolean> => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Para iOS, retorna false para mostrar instruções manuais
      return false;
    }

    if (!deferredPrompt) {
      // Se não há prompt disponível, retorna false
      return false;
    }

    try {
      // Mostra o prompt de instalação
      await deferredPrompt.prompt();
      
      // Aguarda a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`PWA: User response: ${outcome}`);
      
      // Limpa o prompt salvo
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA: Erro durante instalação:', error);
      return false;
    }
  };

  return {
    isInstallable,
    installPWA,
  };
};
