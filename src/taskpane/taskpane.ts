/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

import "office-ui-fabric-react/dist/css/fabric.min.css";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import * as React from "react";
import * as ReactDOM from "react-dom";
import TaskPane from "./TaskPane";

initializeIcons();

let isOfficeInitialized = false;

const render = (Component) => {
  ReactDOM.render(
    React.createElement(Component, { isOfficeInitialized }),
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(TaskPane);
});

let currentAnalysis = null;

// 선택된 텍스트 분석
async function analyzeSelectedText() {
  try {
    await Word.run(async (context) => {
      // 선택된 텍스트 가져오기
      const selection = context.document.getSelection();
      selection.load("text");
      await context.sync();

      // 분석 결과 섹션 표시
      document.getElementById("analysis-results").style.display = "block";
      
      // 텍스트 분석 수행
      const text = selection.text;
      if (!text.trim()) {
        showError("분석할 텍스트를 선택해주세요.");
        return;
      }

      // 문법 검사
      const grammarIssues = await checkGrammar(text);
      displayGrammarIssues(grammarIssues);

      // 문체 분석
      const styleSuggestions = analyzeStyle(text);
      displayStyleSuggestions(styleSuggestions);

      // 가독성 분석
      const readabilityScore = calculateReadability(text);
      displayReadabilityScore(readabilityScore);

      // 개선 사항 적용 버튼 표시
      document.getElementById("apply-suggestions").style.display = "block";

      // 현재 분석 결과 저장
      currentAnalysis = {
        text,
        grammarIssues,
        styleSuggestions,
        readabilityScore
      };
    });
  } catch (error) {
    showError("텍스트 분석 중 오류가 발생했습니다.");
    console.error(error);
  }
}

// 문법 검사 함수
async function checkGrammar(text: string) {
  // TODO: 실제 문법 검사 API 연동
  return [
    { type: "spelling", text: "맞춤법", suggestion: "올바른 맞춤법" },
    { type: "grammar", text: "문법", suggestion: "올바른 문법" }
  ];
}

// 문체 분석 함수
function analyzeStyle(text: string) {
  // TODO: 실제 문체 분석 로직 구현
  return [
    "문장이 너무 깁니다. 간결하게 나누어 보세요.",
    "수동태 대신 능동태를 사용하면 더 명확할 수 있습니다."
  ];
}

// 가독성 점수 계산 함수
function calculateReadability(text: string) {
  // TODO: 실제 가독성 점수 계산 로직 구현
  return {
    score: 85,
    level: "좋음",
    details: "전반적으로 읽기 쉬운 문장입니다."
  };
}

// 문법 이슈 표시 함수
function displayGrammarIssues(issues: any[]) {
  const container = document.getElementById("grammar-issues");
  container.innerHTML = issues.map(issue => `
    <div class="error-text">
      <p>${issue.text}: ${issue.suggestion}</p>
    </div>
  `).join("");
}

// 문체 제안 표시 함수
function displayStyleSuggestions(suggestions: string[]) {
  const container = document.getElementById("style-suggestions");
  container.innerHTML = suggestions.map(suggestion => `
    <div class="suggestion-text">
      <p>${suggestion}</p>
    </div>
  `).join("");
}

// 가독성 점수 표시 함수
function displayReadabilityScore(result: any) {
  const container = document.getElementById("readability-score");
  container.innerHTML = `
    <div class="score-text">${result.score}점</div>
    <p>수준: ${result.level}</p>
    <p>${result.details}</p>
  `;
}

// 개선 사항 적용 함수
async function applySuggestions() {
  if (!currentAnalysis) {
    showError("먼저 텍스트를 분석해주세요.");
    return;
  }

  try {
    await Word.run(async (context) => {
      // TODO: 실제 개선 사항 적용 로직 구현
      const selection = context.document.getSelection();
      selection.insertText("개선된 텍스트가 여기에 들어갑니다.", Word.InsertLocation.replace);
      await context.sync();
    });
  } catch (error) {
    showError("개선 사항 적용 중 오류가 발생했습니다.");
    console.error(error);
  }
}

// 에러 메시지 표시 함수
function showError(message: string) {
  // TODO: 더 나은 에러 표시 UI 구현
  alert(message);
}
