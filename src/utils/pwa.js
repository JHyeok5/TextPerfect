// PWA 관련 유틸리티 함수들

let deferredPrompt;
let isInstalled = false;

// 서비스 워커 등록
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // 업데이트 확인
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 새 버전 사용 가능 알림
                showUpdateAvailable();
              }
            });
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// 앱 설치 프롬프트 처리
export const handleInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // 기본 프롬프트 방지
    e.preventDefault();
    deferredPrompt = e;
    
    // 설치 버튼 표시
    showInstallButton();
  });

  // 설치 완료 감지
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    isInstalled = true;
    hideInstallButton();
    
    // 설치 완료 알림
    showInstallSuccess();
  });
};

// 앱 설치 실행
export const installApp = async () => {
  if (!deferredPrompt) {
    return false;
  }

  try {
    // 설치 프롬프트 표시
    deferredPrompt.prompt();
    
    // 사용자 선택 대기
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      return true;
    } else {
      console.log('User dismissed the install prompt');
      return false;
    }
  } catch (error) {
    console.error('Install error:', error);
    return false;
  } finally {
    deferredPrompt = null;
  }
};

// 설치 가능 여부 확인
export const canInstall = () => {
  return !!deferredPrompt && !isInstalled;
};

// 이미 설치된 앱인지 확인
export const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone || 
         isInstalled;
};

// 푸시 알림 권한 요청
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// 로컬 알림 표시
export const showLocalNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'textperfect-notification',
      renotify: true,
      ...options
    });

    // 클릭 시 앱으로 이동
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
};

// 네트워크 상태 확인
export const getNetworkStatus = () => {
  return {
    online: navigator.onLine,
    connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection
  };
};

// 오프라인 상태 감지
export const handleOfflineStatus = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// UI 헬퍼 함수들
const showInstallButton = () => {
  const event = new CustomEvent('pwa:install-available');
  window.dispatchEvent(event);
};

const hideInstallButton = () => {
  const event = new CustomEvent('pwa:install-completed');
  window.dispatchEvent(event);
};

const showInstallSuccess = () => {
  const event = new CustomEvent('pwa:install-success');
  window.dispatchEvent(event);
};

const showUpdateAvailable = () => {
  const event = new CustomEvent('pwa:update-available');
  window.dispatchEvent(event);
};

// 앱 업데이트 적용
export const applyUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  }
};

// 앱 정보 가져오기
export const getAppInfo = () => {
  return {
    isInstalled: isAppInstalled(),
    canInstall: canInstall(),
    isOnline: navigator.onLine,
    isPWA: isAppInstalled(),
    platform: navigator.platform,
    userAgent: navigator.userAgent
  };
}; 