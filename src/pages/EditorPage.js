import React from 'react';
import TextEditor from '../components/editor/TextEditor';

const EditorPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">텍스트 에디터</h1>
        <p className="text-gray-600 mt-2">
          최적화하려는 텍스트를 입력하고 목적과 세부 옵션을 선택한 후 '텍스트 최적화' 버튼을 클릭하세요.
        </p>
      </div>
      
      <TextEditor />
      
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">도움말</h3>
        <ul className="text-sm text-blue-700 space-y-1 ml-5 list-disc">
          <li>텍스트는 1,000자 이내로 입력해주세요 (무료 사용자 한도).</li>
          <li>더 나은 결과를 위해 최소 200자 이상 입력하는 것을 권장합니다.</li>
          <li>목적에 맞는 옵션을 선택하면 더 적합한 최적화 결과를 얻을 수 있습니다.</li>
          <li>형식성, 간결성, 용어 수준을 조정하여 원하는 스타일로 텍스트를 최적화하세요.</li>
          <li>결과 페이지에서 변경 사항을 자세히 확인하고 다운로드할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default EditorPage; 