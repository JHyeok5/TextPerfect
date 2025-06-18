import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Card - 헤더/바디/푸터, 그림자/보더/호버 지원 공통 카드 컴포넌트
 *
 * @component
 * @param {object} props
 * @param {React.ReactNode} [props.header] - 카드 상단
 * @param {React.ReactNode} [props.footer] - 카드 하단
 * @param {React.ReactNode} props.children - 카드 본문
 * @param {boolean} [props.shadow=true] - 그림자
 * @param {boolean} [props.border=false] - 보더
 * @param {boolean} [props.hover=false] - 호버 효과
 * @param {string} [props.className] - 추가 클래스
 *
 * @example
 * <Card header="제목" footer="푸터">본문</Card>
 */
export default function Card({ header, footer, children, shadow = true, border = false, hover = false, className = '', ...props }) {
  return (
    <div
      className={classNames(
        'rounded-lg bg-white',
        shadow && 'shadow-md',
        border && 'border border-gray-200',
        hover && 'hover:shadow-lg transition-shadow',
        className
      )}
      {...props}
    >
      {header && <div className="px-6 pt-4 pb-2 border-b border-gray-100 font-semibold">{header}</div>}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="px-6 pt-2 pb-4 border-t border-gray-100 text-sm text-gray-500">{footer}</div>}
    </div>
  );
}

Card.propTypes = {
  header: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  shadow: PropTypes.bool,
  border: PropTypes.bool,
  hover: PropTypes.bool,
  className: PropTypes.string,
}; 