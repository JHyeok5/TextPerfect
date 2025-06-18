// localStorage 관리 유틸리티
export const storage = {
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};

// 사용자 데이터 관리
export function saveUser(user) {
  storage.set('tp_user', user);
}
export function getUser() {
  return storage.get('tp_user');
}
export function removeUser() {
  storage.remove('tp_user');
}

// 설정 관리
export function saveSettings(settings) {
  storage.set('tp_settings', settings);
}
export function getSettings() {
  return storage.get('tp_settings');
}

// 캐시 관리
export function saveCache(key, data) {
  storage.set(`tp_cache_${key}`, data);
}
export function getCache(key) {
  return storage.get(`tp_cache_${key}`);
}
export function clearCache(key) {
  storage.remove(`tp_cache_${key}`);
} 