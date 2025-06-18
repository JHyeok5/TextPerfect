import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * ProgressBar - 진행률/경험치 표시, 애니메이션 지원 공통 컴포넌트
 *
 * @component
 * @param {object} props
 * @param {number} props.value - 현재 값
 * @param {number} [props.max=100] - 최대값
 * @param {string} [props.color='bg-blue-600'] - 색상 클래스
 * @param {string} [props.height='h-3'] - 높이 클래스
 * @param {boolean} [props.showLabel=false] - % 표시
 * @param {string} [props.className] - 추가 클래스
 *
 * @example
 * <ProgressBar value={70} max={100} color="bg-green-500" showLabel />
 */
export default function ProgressBar({ value, max = 100, color = 'bg-blue-600', height = 'h-3', showLabel = false, className = '' }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={classNames('w-full bg-gray-200 rounded-full overflow-hidden', height, className)}>
      <div
        className={classNames('transition-all duration-500', color)}
        style={{ width: `${percent}%` }}
      />
      {showLabel && (
        <span className="block text-xs text-center mt-1 text-gray-600">{percent}%</span>
      )}
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  color: PropTypes.string,
  height: PropTypes.string,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
}; 