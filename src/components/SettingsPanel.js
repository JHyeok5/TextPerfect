import React from 'react';
import { useTextContext } from '../context/TextContext';

const SettingsPanel = () => {
  const { 
    purpose, 
    setPurpose, 
    options, 
    setOptions,
    isLoading
  } = useTextContext();

  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
  };

  const handleOptionChange = (optionName, value) => {
    setOptions({ [optionName]: value });
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        최적화 설정
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          목적
        </label>
        <select
          className="form-select"
          value={purpose}
          onChange={handlePurposeChange}
          disabled={isLoading}
        >
          <option value="general">일반</option>
          <option value="academic">학술</option>
          <option value="business">비즈니스</option>
          <option value="technical">기술</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          {purpose === 'general' && '일반적인 목적의 텍스트를 최적화합니다.'}
          {purpose === 'academic' && '논문, 학술 보고서 등 학술적 용도의 텍스트를 최적화합니다.'}
          {purpose === 'business' && '비즈니스 이메일, 제안서 등 업무용 텍스트를 최적화합니다.'}
          {purpose === 'technical' && '기술 문서, 매뉴얼 등 전문적인 텍스트를 최적화합니다.'}
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            형식성 수준
          </label>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">비격식적</span>
            <input
              type="range"
              min="0"
              max="100"
              value={options.formality}
              onChange={(e) => handleOptionChange('formality', parseInt(e.target.value))}
              className="flex-grow form-range"
              disabled={isLoading}
            />
            <span className="text-xs text-gray-500 ml-2">격식적</span>
          </div>
          <div className="mt-1 text-sm text-center">
            {options.formality < 30 && '친근하고 편안한 톤'}
            {options.formality >= 30 && options.formality < 70 && '중립적인 톤'}
            {options.formality >= 70 && '공식적이고 전문적인 톤'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            간결성 수준
          </label>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">자세함</span>
            <input
              type="range"
              min="0"
              max="100"
              value={options.conciseness}
              onChange={(e) => handleOptionChange('conciseness', parseInt(e.target.value))}
              className="flex-grow form-range"
              disabled={isLoading}
            />
            <span className="text-xs text-gray-500 ml-2">간결함</span>
          </div>
          <div className="mt-1 text-sm text-center">
            {options.conciseness < 30 && '상세하고 자세한 설명'}
            {options.conciseness >= 30 && options.conciseness < 70 && '균형 잡힌 길이'}
            {options.conciseness >= 70 && '간결하고 핵심만 전달'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            용어 수준
          </label>
          <div className="flex justify-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="terminology"
                value="basic"
                checked={options.terminology === 'basic'}
                onChange={() => handleOptionChange('terminology', 'basic')}
                disabled={isLoading}
              />
              <span className="ml-2 text-sm">기본</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="terminology"
                value="advanced"
                checked={options.terminology === 'advanced'}
                onChange={() => handleOptionChange('terminology', 'advanced')}
                disabled={isLoading}
              />
              <span className="ml-2 text-sm">전문</span>
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500 text-center">
            {options.terminology === 'basic' ? '일반인도 이해하기 쉬운 용어 사용' : '전문가를 위한 전문 용어 사용'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 