
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
  const [isIOS, setIsIOS] = useState(false);

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

    // Detecção melhorada para iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(isIOSDevice);
    
    if (isStandalone || isInWebAppiOS) {
      console.log('PWA: App já está instalado');
      setIsInstallable(false);
    } else {
      // Para iOS Safari, sempre mostra como instalável se não estiver em standalone
      if (isIOSDevice) {
        setIsInstallable(true);
        console.log('PWA: iOS detectado - instruções manuais necessárias');
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async (): Promise<{ success: boolean; isIOS: boolean; message?: string }> => {
    if (isIOS) {
      // Para iOS, retorna informações para mostrar instruções manuais
      return { 
        success: false, 
        isIOS: true,
        message: 'Para instalar no iPhone:\n1. Toque no botão de compartilhar (ícone da caixa com seta)\n2. Role para baixo e toque em "Adicionar à Tela de Início"\n3. Toque em "Adicionar" no canto superior direito'
      };
    }

    if (!deferredPrompt) {
      // Se não há prompt disponível para Android/outros browsers
      return { 
        success: false, 
        isIOS: false,
        message: 'Instalação não disponível neste navegador ou app já instalado'
      };
    }

    try {
      // Mostra o prompt de instalação para Android
      await deferredPrompt.prompt();
      
      // Aguarda a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`PWA: User response: ${outcome}`);
      
      // Limpa o prompt salvo
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      
      return { success: outcome === 'accepted', isIOS: false };
    } catch (error) {
      console.error('PWA: Erro durante instalação:', error);
      return { success: false, isIOS: false, message: 'Erro durante a instalação' };
    }
  };

  return {
    isInstallable,
    installPWA,
    isIOS,
  };
};
