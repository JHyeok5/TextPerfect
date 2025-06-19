# 공통 컴포넌트 가이드

## Button
- **설명**: 다양한 스타일/사이즈/로딩/아이콘 지원 버튼
- **Props**:
  | 이름         | 타입      | 기본값     | 설명                  |
  |--------------|-----------|------------|-----------------------|
  | variant      | string    | 'primary'  | 스타일 (primary 등)   |
  | size         | string    | 'md'       | 크기(sm, md, lg)      |
  | loading      | bool      | false      | 로딩 스피너 표시      |
  | disabled     | bool      | false      | 비활성화              |
  | icon         | element   | -          | 아이콘 컴포넌트       |
  | iconPosition | string    | 'left'     | 아이콘 위치           |

- **예시**:
```jsx
<Button variant="primary" size="lg" loading icon={CheckIcon}>확인</Button>
```

---

## Modal
- **설명**: 닫기/ESC/배경 클릭, 애니메이션 지원 모달
- **Props**:
  | 이름         | 타입      | 기본값     | 설명                  |
  |--------------|-----------|------------|-----------------------|
  | open         | bool      | -          | 모달 열림 여부        |
  | onClose      | func      | -          | 닫기 콜백             |
  | animation    | string    | 'fade'     | 애니메이션(fade 등)   |

- **예시**:
```jsx
<Modal open={isOpen} onClose={closeModal}>내용</Modal>
```

---

## Card
- **설명**: 헤더/바디/푸터, 그림자/보더/호버 지원 카드
- **Props**:
  | 이름         | 타입      | 기본값     | 설명                  |
  |--------------|-----------|------------|-----------------------|
  | header       | node      | -          | 카드 상단             |
  | footer       | node      | -          | 카드 하단             |
  | shadow       | bool      | true       | 그림자                |
  | border       | bool      | false      | 보더                  |
  | hover        | bool      | false      | 호버 효과             |

- **예시**:
```jsx
<Card header="제목" footer="푸터">본문</Card>
```

---

## ProgressBar
- **설명**: 진행률/경험치 표시, 애니메이션 지원
- **Props**:
  | 이름         | 타입      | 기본값     | 설명                  |
  |--------------|-----------|------------|-----------------------|
  | value        | number    | -          | 현재 값               |
  | max          | number    | 100        | 최대값                |
  | color        | string    | 'bg-blue-600'| 색상 클래스         |
  | height       | string    | 'h-3'      | 높이 클래스           |
  | showLabel    | bool      | false      | % 표시                |

- **예시**:
```jsx
<ProgressBar value={70} max={100} color="bg-green-500" showLabel />
```

---

## Badge
- **설명**: 레벨/상태, 색상/아이콘 지원 뱃지
- **Props**:
  | 이름         | 타입      | 기본값     | 설명                  |
  |--------------|-----------|------------|-----------------------|
  | variant      | string    | 'default'  | 색상                  |
  | icon         | element   | -          | 아이콘 컴포넌트       |

- **예시**:
```jsx
<Badge variant="success" icon={CheckIcon}>성공</Badge>
```

---

## LoadingSpinner
- **설명**: 전체화면/인라인, 크기/색상 커스텀 로딩
- **Props**:
  | 이름         | 타입      | 기본값     | 설명                  |
  |--------------|-----------|------------|-----------------------|
  | fullscreen   | bool      | false      | 전체화면 여부         |
  | size         | string    | 'md'       | 크기(sm,md,lg)        |
  | color        | string    | 'text-blue-600'| 색상 클래스        |

- **예시**:
```jsx
<LoadingSpinner size="lg" fullscreen />
```

---

# 레이아웃 컴포넌트 가이드

## Layout
- **설명**: 앱의 전체적인 페이지 레이아웃을 구성하는 메인 컨테이너입니다. 사이드바와 메인 콘텐츠 영역을 포함합니다.
- **Props**:
  | 이름     | 타입   | 기본값 | 설명                  |
  |----------|--------|--------|-----------------------|
  | children | node   | -      | 페이지의 실제 콘텐츠  |

- **예시**:
```jsx
<Layout>
  <DashboardPage />
</Layout>
```

---

## Header
- **설명**: 앱의 상단 헤더 영역입니다. 현재 페이지 제목, 사용자 메뉴 등을 표시합니다.
- **Props**:
  | 이름         | 타입   | 기본값 | 설명                  |
  |--------------|--------|--------|-----------------------|
  | sidebarOpen  | bool   | -      | 사이드바 열림 상태    |
  | setSidebarOpen| func  | -      | 사이드바 상태 변경 함수|

---

## Sidebar
- **설명**: 앱의 좌측 내비게이션 메뉴 영역입니다. 페이지 이동 링크 목록을 표시합니다.
- **Props**: 없음

---

## Footer
- **설명**: 앱의 하단 푸터 영역입니다. 저작권 정보 등을 표시합니다.
- **Props**: 없음

---

> 각 컴포넌트는 Tailwind 기반으로, props로 커스터마이즈 가능하며, PropTypes로 타입 체크가 적용되어 있습니다. 