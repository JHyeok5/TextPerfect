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
      <div className="ms-welcome__main">
        <h2 className="ms-font-xl">Please sideload your add-in to see app body.</h2>
      </div>
    );
  }

  return (
    <div className="ms-welcome__main">
      <header className="ms-welcome__header ms-bgColor-neutralLighter">
        <img width="90" height="90" src="../../assets/logo-filled.png" alt="TextPerfect" title="TextPerfect" />
        <h1 className="ms-font-su">TextPerfect</h1>
      </header>

      <div className="ms-Grid">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12">
            <div className="analysis-section">
              <h2 className="ms-font-xl">텍스트 분석</h2>
              <button className="ms-Button ms-Button--primary" onClick={analyzeSelectedText}>
                <span className="ms-Button-label">선택한 텍스트 분석</span>
              </button>

              {showResults && currentAnalysis && (
                <div className="results-section">
                  <h3 className="ms-font-l">분석 결과</h3>
                  
                  <div className="result-item">
                    <h4 className="ms-font-m">문법 검사</h4>
                    <div>
                      {currentAnalysis.grammarIssues.map((issue, index) => (
                        <div key={index} className="error-text">
                          <p>{issue.text}: {issue.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="result-item">
                    <h4 className="ms-font-m">문체 분석</h4>
                    <div>
                      {currentAnalysis.styleSuggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-text">
                          <p>{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="result-item">
                    <h4 className="ms-font-m">가독성 분석</h4>
                    <div>
                      <div className="score-text">{currentAnalysis.readabilityScore.score}점</div>
                      <p>수준: {currentAnalysis.readabilityScore.level}</p>
                      <p>{currentAnalysis.readabilityScore.details}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showResults && (
              <div className="improvement-section">
                <button className="ms-Button ms-Button--hero" onClick={applySuggestions}>
                  <span className="ms-Button-label">개선 사항 적용</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPane; 