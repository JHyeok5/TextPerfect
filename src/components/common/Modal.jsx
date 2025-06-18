import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Modal - 닫기/ESC/배경 클릭, 애니메이션 지원 공통 모달 컴포넌트
 *
 * @component
 * @param {object} props
 * @param {boolean} props.open - 모달 열림 여부
 * @param {function} [props.onClose] - 닫기 콜백
 * @param {React.ReactNode} props.children - 모달 내용
 * @param {string} [props.className] - 추가 클래스
 * @param {string} [props.overlayClass] - 오버레이 클래스
 * @param {boolean} [props.showClose=true] - 닫기 버튼 표시
 * @param {'fade'|'slide'} [props.animation='fade'] - 애니메이션
 *
 * @example
 * <Modal open={isOpen} onClose={closeModal}>내용</Modal>
 */
export default function Modal({ open, onClose, children, className = '', overlayClass = '', showClose = true, animation = 'fade', ...props }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={classNames('fixed inset-0 z-50 flex items-center justify-center', overlayClass)}
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className={classNames(
          'bg-white rounded-lg shadow-lg relative min-w-[300px] max-w-full',
          animation === 'fade' ? 'animate-fadeIn' : '',
          animation === 'slide' ? 'animate-slideUp' : '',
          className
        )}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        {showClose && (
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose} aria-label="Close">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  overlayClass: PropTypes.string,
  showClose: PropTypes.bool,
  animation: PropTypes.oneOf(['fade', 'slide']),
}; 