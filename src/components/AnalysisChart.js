import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useTextContext } from '../context/TextContext';

// Register ChartJS components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const AnalysisChart = () => {
  const { analysis } = useTextContext();
  
  if (!analysis) {
    return (
      <div className="card h-full flex items-center justify-center">
        <p className="text-gray-500">분석 데이터가 없습니다.</p>
      </div>
    );
  }
  
  const chartData = {
    labels: ['가독성', '전문성', '명확성', '간결성', '적절성'],
    datasets: [
      {
        label: '텍스트 분석',
        data: [
          analysis.readability || 0,
          analysis.professionalLevel || 0,
          analysis.clarity || 0,
          analysis.conciseness || 0,
          analysis.relevance || 0
        ],
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}/100`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        텍스트 분석
      </h2>
      
      <div className="h-64">
        <Radar data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-6 space-y-3">
        {analysis.readability !== undefined && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700">가독성</span>
              <span className="text-sm font-medium">{analysis.readability}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${analysis.readability}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              텍스트가 얼마나 쉽게 읽히고 이해되는지를 나타냅니다.
            </p>
          </div>
        )}
        
        {analysis.professionalLevel !== undefined && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700">전문성</span>
              <span className="text-sm font-medium">{analysis.professionalLevel}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${analysis.professionalLevel}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              텍스트의 전문적인 수준과, 해당 분야의 지식을 얼마나 잘 반영하는지를 평가합니다.
            </p>
          </div>
        )}
        
        {analysis.clarity !== undefined && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700">명확성</span>
              <span className="text-sm font-medium">{analysis.clarity}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${analysis.clarity}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              의미가 얼마나 명확하게 전달되는지, 모호함이나 혼란스러운 표현이 없는지를 평가합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisChart; 