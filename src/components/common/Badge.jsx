import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const VARIANTS = {
  default: 'bg-gray-200 text-gray-800',
  primary: 'bg-blue-600 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-400 text-black',
  danger: 'bg-red-500 text-white',
};

/**
 * Badge - 레벨/상태, 색상/아이콘 지원 공통 뱃지 컴포넌트
 *
 * @component
 * @param {object} props
 * @param {'default'|'primary'|'success'|'warning'|'danger'} [props.variant='default'] - 색상
 * @param {React.ElementType} [props.icon] - 아이콘 컴포넌트
 * @param {string} [props.className] - 추가 클래스
 * @param {React.ReactNode} props.children - 뱃지 내용
 *
 * @example
 * <Badge variant="success" icon={CheckIcon}>성공</Badge>
 */
export default function Badge({ children, variant = 'default', icon: Icon, className = '', ...props }) {
  return (
    <span className={classNames('inline-flex items-center px-2 py-0.5 rounded text-xs font-bold', VARIANTS[variant], className)} {...props}>
      {Icon && <Icon className="w-4 h-4 mr-1" />}
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger']),
  icon: PropTypes.elementType,
  className: PropTypes.string,
}; 