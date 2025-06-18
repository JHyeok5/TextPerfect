// TailwindCSS 색상 팔레트 확장
export const COLORS = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-100 text-gray-900',
  accent: 'bg-yellow-400 text-black',
  danger: 'bg-red-500 text-white',
  success: 'bg-green-500 text-white',
  info: 'bg-sky-500 text-white',
  // 커스텀 색상
  brand: 'bg-indigo-700 text-white',
  dark: 'bg-gray-900 text-white',
};

// 컴포넌트별 공통 스타일 클래스
export const COMPONENT_CLASSES = {
  button: 'rounded px-4 py-2 font-semibold transition-colors duration-200',
  card: 'rounded-lg shadow-md p-6 bg-white',
  modal: 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50',
  input: 'border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
  badge: 'inline-block px-2 py-1 rounded text-xs font-bold',
};

// 애니메이션/트랜지션 설정
export const ANIMATION = {
  fade: 'transition-opacity duration-300',
  slideUp: 'transform transition-transform duration-300 ease-in-out',
  pop: 'transition-transform duration-200 scale-95',
}; 