import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SIZES = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-16 h-16',
};

/**
 * LoadingSpinner - 전체화면/인라인, 크기/색상 커스텀 로딩 컴포넌트
 *
 * @component
 * @param {object} props
 * @param {boolean} [props.fullscreen=false] - 전체화면 여부
 * @param {'sm'|'md'|'lg'} [props.size='md'] - 크기
 * @param {string} [props.color='text-blue-600'] - 색상 클래스
 * @param {string} [props.className] - 추가 클래스
 *
 * @example
 * <LoadingSpinner size="lg" fullscreen />
 */
export default function LoadingSpinner({ fullscreen = false, size = 'md', color = 'text-blue-600', className = '' }) {
  const spinner = (
    <svg className={classNames('animate-spin', SIZES[size], color, className)} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        {spinner}
      </div>
    );
  }
  return spinner;
}

LoadingSpinner.propTypes = {
  fullscreen: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.string,
  className: PropTypes.string,
}; 