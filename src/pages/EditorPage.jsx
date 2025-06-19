import React, { useState } from 'react';
import TextEditor from '../components/editor/TextEditor';
import Button from '../components/common/Button';

export default function EditorPage() {
  const [text, setText] = useState('');

  const handleOptimize = () => {
    // TODO: 텍스트 최적화 API 호출 로직 구현
    console.log('Optimizing text:', text);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">텍스트 에디터</h1>
      <div className="flex-grow">
        <TextEditor value={text} onChange={setText} />
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleOptimize} variant="primary">
          텍스트 최적화
        </Button>
      </div>
    </div>
  );
} 