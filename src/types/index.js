// TypeScript 타입 정의를 위한 파일
// 현재는 JavaScript를 사용하므로 PropTypes로 타입 검증

export const UserType = {
  id: 'string',
  name: 'string', 
  email: 'string',
  subscription: 'string',
  createdAt: 'string'
};

export const TextAnalysisType = {
  readability: 'number',
  clarity: 'number',
  professionalism: 'number',
  conciseness: 'number'
};

export const OptimizationOptionsType = {
  formality: 'number',
  conciseness: 'number', 
  terminology: 'string'
};

export const SubscriptionPlanType = {
  id: 'string',
  name: 'string',
  price: 'number',
  features: 'array'
}; 