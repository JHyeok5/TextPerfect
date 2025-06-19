import React, { useState, useEffect } from 'react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import * as Office from 'office-js';

initializeIcons();

interface Analysis {
  grammarIssues: Array<{
    type: string;
    text: string;
    suggestion: string;
  }>;
  styleSuggestions: string[];
  readabilityScore: {
    score: number;
    level: string;
    details: string;
  };
}

interface Props {
  isOfficeInitialized: boolean;
}

const TaskPane: React.FC<Props> = ({ isOfficeInitialized }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [showResults, setShowResults] = useState(false);

  const analyzeSelectedText = async () => {
    try {
      await Word.run(async (context) => {
        const selection = context.document.getSelection();
        selection.load("text");
        await context.sync();

        const text = selection.text;
        if (!text.trim()) {
          alert("분석할 텍스트를 선택해주세요.");
          return;
        }

        // 임시 분석 결과
        const analysis: Analysis = {
          grammarIssues: [
            { type: "spelling", text: "맞춤법", suggestion: "올바른 맞춤법" },
            { type: "grammar", text: "문법", suggestion: "올바른 문법" }
          ],
          styleSuggestions: [
            "문장이 너무 깁니다. 간결하게 나누어 보세요.",
            "수동태 대신 능동태를 사용하면 더 명확할 수 있습니다."
          ],
          readabilityScore: {
            score: 85,
            level: "좋음",
            details: "전반적으로 읽기 쉬운 문장입니다."
          }
        };

        setCurrentAnalysis(analysis);
        setShowResults(true);
      });
    } catch (error) {
      console.error('Error:', error);
      alert("텍스트 분석 중 오류가 발생했습니다.");
    }
  };

  const applySuggestions = async () => {
    if (!currentAnalysis) {
      alert("먼저 텍스트를 분석해주세요.");
      return;
    }

    try {
      await Word.run(async (context) => {
        const selection = context.document.getSelection();
        selection.insertText("개선된 텍스트가 여기에 들어갑니다.", Word.InsertLocation.replace);
        await context.sync();
      });
    } catch (error) {
      console.error('Error:', error);
      alert("개선 사항 적용 중 오류가 발생했습니다.");
    }
  };

  if (!isOfficeInitialized) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>텍스트 분석</h2>
        <button onClick={() => window.analyzeSelectedText()}>선택된 텍스트 분석</button>
      </div>

      <div id="analysis-results" style={{ display: "none" }}>
        <h3>분석 결과</h3>
        
        <div>
          <h4>문법 검사</h4>
          <div id="grammar-issues"></div>
        </div>

        <div>
          <h4>문체 분석</h4>
          <div id="style-suggestions"></div>
        </div>

        <div>
          <h4>가독성 점수</h4>
          <div id="readability-score"></div>
        </div>

        <button id="apply-suggestions" style={{ display: "none" }} onClick={() => window.applySuggestions()}>
          개선 사항 적용
        </button>
      </div>
    </div>
  );
};

export default TaskPane; 