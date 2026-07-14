# 🎨 [템플릿 4] 모바일 프리미엄 디자인 시스템 & CSS 가이드

웹앱의 세련된 3D 섀도우, 애니메이션 및 2열 통장 카드를 구현하는 핵심 CSS 코드와 디자인 토큰 스펙입니다.

---

## 🎨 1. 디자인 시스템 토큰 변수
일관성 있고 눈이 편안한 포레스트 그린 테마를 구현하기 위해 `:root` 에 변수로 정의하여 사용합니다.

```css
:root {
  /* 색상 스펙 */
  --primary: #0f4c3a;          /* 딥 포레스트 그린 */
  --primary-light: #eaf4f1;    /* 민트/그린 라이트 배경 틴트 */
  --primary-dark: #093327;     /* 딥 다크 그린 */
  --accent: #b8860b;           /* 클래식 뮤티드 골드 */
  --accent-light: #faf5eb;     /* 연한 골드 틴트 */
  --background: #f8f9f6;       /* 연그레이/크림톤 전체 배경 */
  --surface: #ffffff;          /* 순백색 카드 표면 */
  --border-color: rgba(15, 76, 58, 0.08); /* 얇은 테두리 */
  
  /* 타이포그래피 */
  --font-kor: 'Noto Sans KR', sans-serif;
  --font-eng: 'Outfit', sans-serif;
  
  /* 반응형 모서리 둥글기 */
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  
  /* 부드러운 다중 그림자 (Soft Layered Shadow) */
  --shadow-sm: 0 2px 8px rgba(15, 76, 58, 0.02);
  --shadow-md: 0 8px 24px rgba(15, 76, 58, 0.04), 0 2px 6px rgba(0, 0, 0, 0.01);
  --shadow-lg: 0 16px 36px rgba(15, 76, 58, 0.08), 0 4px 12px rgba(0, 0, 0, 0.02);
}
```

---

## 🧱 2. 주요 명품 UI 컴포넌트 CSS 구조

### 1) 가로 2열 배치 통장 카드 (`.bank-card`)
모바일 가로폭 좁은 화면에서도 줄 바꿈이 생기지 않도록 `letter-spacing`과 자간을 압축 조율합니다.
```css
.bank-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}
.bank-card {
  border-radius: var(--radius-md);
  padding: 12px 10px;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.bank-card:active {
  transform: scale(0.97); /* 원클릭 카드 전체 터치 시 물리적 축소 효과 */
  opacity: 0.95;
}
.bank-card-number {
  font-size: 14px;
  font-weight: 800;
  font-family: var(--font-eng);
  letter-spacing: -0.3px; /* 자간 압축 */
  word-break: break-all;
}
```

### 2) 3D 입체 집행부 카드 (`.exec-card`)
```css
.exec-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}
.exec-card {
  background-color: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
/* 카드 호버 시 위로 솟으며 깊어지는 3D 섀도우 효과 */
.exec-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(15, 76, 58, 0.2);
}
```

### 3) 모바일 바텀 슬라이드 업 드로어 (`.drawer-content`)
```css
.drawer-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.drawer-content {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); /* 가로 480px 정중앙 고정 */
  width: 100%;
  max-width: 480px;
  background-color: var(--surface);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px 20px 30px;
  z-index: 1100;
  box-shadow: 0 -10px 30px rgba(15, 76, 58, 0.12);
  border: 1px solid var(--border-color);
  animation: slide-up 0.28s cubic-bezier(0.4, 0, 0.2, 1); /* 미끄러지듯 스르륵 올라오는 효과 */
}
@keyframes slide-up {
  from { transform: translate(-50%, 100%); }
  to { transform: translate(-50%, 0); }
}
```
