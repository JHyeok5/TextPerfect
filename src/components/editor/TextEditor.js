import React from 'react';

const TextEditor = ({ value, onChange }) => {
  return (
    <div className="relative w-full h-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="최적화할 텍스트를 입력해주세요..."
      />
      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
        {value.length}자
      </div>
    </div>
  );
};

export default TextEditor; 