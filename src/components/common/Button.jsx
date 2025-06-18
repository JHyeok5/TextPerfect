import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-blue-600 text-blue-600 bg-white hover:bg-blue-50',
  ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Button - 다양한 스타일/사이즈/로딩/아이콘 지원 공통 버튼 컴포넌트
 *
 * @component
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.variant='primary'] - 버튼 스타일
 * @param {'sm'|'md'|'lg'} [props.size='md'] - 버튼 크기
 * @param {boolean} [props.loading=false] - 로딩 상태
 * @param {boolean} [props.disabled=false] - 비활성화
 * @param {React.ElementType} [props.icon] - 아이콘 컴포넌트
 * @param {'left'|'right'} [props.iconPosition='left'] - 아이콘 위치
 * @param {string} [props.className] - 추가 클래스
 * @param {React.ReactNode} props.children - 버튼 내용
 *
 * @example
 * <Button variant="primary" size="lg" loading icon={CheckIcon}>확인</Button>
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  return (
    <button
      className={classNames(
        'rounded font-semibold transition-colors duration-200 flex items-center justify-center gap-2',
        VARIANTS[variant],
        SIZES[size],
        disabled || loading ? 'opacity-60 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="animate-spin mr-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
        </span>
      )}
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
}; 