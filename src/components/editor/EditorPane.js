import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../common/LoadingSpinner';

const EditorPane = ({ text, onChange, isProcessing, error, onOptimize }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <label
          htmlFor="editor"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          텍스트 입력
        </label>
        <textarea
          id="editor"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-64 p-3 border rounded-lg resize-none ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="최적화할 텍스트를 입력해주세요..."
          disabled={isProcessing}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {text.length} 자
        </div>
        <button
          onClick={onOptimize}
          disabled={isProcessing || !text.trim()}
          className={`
            px-4 py-2 rounded-lg font-medium
            ${
              isProcessing || !text.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center">
              <LoadingSpinner className="w-5 h-5 mr-2" />
              처리 중...
            </div>
          ) : (
            '텍스트 최적화'
          )}
        </button>
      </div>
    </div>
  );
};

EditorPane.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onOptimize: PropTypes.func.isRequired
};

export default EditorPane; 