
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
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App foi instalada');
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Detecção melhorada para diferentes dispositivos
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(isIOSDevice);
    
    console.log('PWA: Detecção de dispositivo:', {
      isIOSDevice,
      isInWebAppiOS,
      isStandalone,
      userAgent: navigator.userAgent
    });

    // Se já está em modo standalone, não mostrar botão de instalação
    if (isStandalone || isInWebAppiOS || isInWebAppChrome) {
      console.log('PWA: App já está em modo standalone');
      setIsInstallable(false);
    } else {
      // Para dispositivos não-iOS, aguardar o evento beforeinstallprompt
      if (!isIOSDevice) {
        // Timeout para detectar se o evento beforeinstallprompt não disparar
        const timeout = setTimeout(() => {
          console.log('PWA: beforeinstallprompt não disparou, verificando compatibilidade');
          // Verifica se o navegador suporta service workers
          if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
            setIsInstallable(true);
          }
        }, 3000);

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        
        return () => {
          clearTimeout(timeout);
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        };
      } else {
        // Para iOS, sempre mostrar como instalável se não estiver em standalone
        setIsInstallable(true);
        console.log('PWA: iOS detectado - botão de instalação habilitado');
      }
    }

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async (): Promise<{ success: boolean; isIOS: boolean; message?: string }> => {
    console.log('PWA: Tentativa de instalação iniciada', { isIOS, deferredPrompt });

    if (isIOS) {
      console.log('PWA: Dispositivo iOS detectado');
      return { 
        success: false, 
        isIOS: true,
        message: 'Para instalar no iPhone/iPad:\n\n1. Toque no botão "Compartilhar" (□↗) na barra inferior do Safari\n2. Role para baixo e toque em "Adicionar à Tela de Início"\n3. Toque em "Adicionar" no canto superior direito\n\nO app aparecerá na sua tela inicial!'
      };
    }

    // Para Android e outros dispositivos
    if (!deferredPrompt) {
      console.log('PWA: Nenhum prompt de instalação disponível');
      
      // Verifica se o app já está instalado
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return { 
          success: false, 
          isIOS: false,
          message: 'O app já está instalado!'
        };
      }

      // Instruções para instalação manual no Android
      return { 
        success: false, 
        isIOS: false,
        message: 'Para instalar:\n\n1. Toque no menu (⋮) do navegador\n2. Toque em "Instalar app" ou "Adicionar à tela inicial"\n3. Confirme a instalação\n\nSe não aparecer a opção, seu navegador pode não suportar PWA.'
      };
    }

    try {
      console.log('PWA: Mostrando prompt de instalação');
      await deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA: Resposta do usuário: ${outcome}`);
      
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
        return { success: true, isIOS: false };
      } else {
        return { success: false, isIOS: false, message: 'Instalação cancelada pelo usuário' };
      }
    } catch (error) {
      console.error('PWA: Erro durante instalação:', error);
      return { 
        success: false, 
        isIOS: false, 
        message: 'Erro durante a instalação. Tente novamente ou use a instalação manual do navegador.' 
      };
    }
  };

  return {
    isInstallable,
    installPWA,
    isIOS,
  };
};
