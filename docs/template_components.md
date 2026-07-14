# ⚛️ [템플릿 3] React 핵심 UI 컴포넌트 소스코드 명세

웹앱을 가동하는 핵심 React 컴포넌트들의 내부 로직 뼈대와 역할 정리입니다.

---

## 📂 1. 핵심 컴포넌트 아키텍처

```
src/
├── supabaseClient.ts  # Supabase 연동 인스턴스 정의
├── App.tsx            # 메인 데이터 분기 가동 및 상태 관리 최상위 부모
├── components/
│   ├── BottomNav.tsx      # 하단 모바일 스타일 탭 버튼바
│   ├── MembersTab.tsx     # 주소록 탭 (검색, 필터, 임원 3D 위젯)
│   ├── MemberDetail.tsx   # 회원 정보 상세 바텀 슬라이드 드로어
│   ├── RulesDrawer.tsx    # 회칙 접이식 아코디언 및 통합 검색 뷰어 드로어
│   ├── ScheduleTab.tsx    # D-day 디데이, 1/2부 약속장소 지도 길찾기 카드
│   └── AdminTab.tsx       # 관리자 로그인 인증, CRUD 폼 제어 및 임명 스왑
└── data/
    ├── members.json       # DB 미동작 시 백업용 기본 더미 회원 목록
    └── rulesData.ts       # 추출된 회칙 정적 텍스트 배열
```

---

## 💻 2. 핵심 로직 코드 뼈대

### 1) `App.tsx` 최상위 상태(State) 설계
```typescript
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [activeTab, setActiveTab] = useState<string>('members'); // 탭 제어
  const [members, setMembers] = useState<Member[]>([]);          // 회원 데이터
  const [schedules, setSchedules] = useState<MeetingSchedule[]>([]); // 일정 데이터
  const [accounts, setAccounts] = useState<BankAccount[]>([]);    // 계좌 데이터
  const [selectedMember, setSelectedMember] = useState<Member | null>(null); // 상세 보기용
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false); // 회칙 모달 토글

  // DB 사용 여부 검증 (DB 주소/키가 없으면 로컬 스토리지 데모 모드로 가동)
  const isUsingDB = isSupabaseConfigured();
  
  // (App.tsx 내에서 fetchMembers, fetchSchedules, fetchAccounts를
  //  useEffect에서 실행하여 상태 데이터에 채워줌)
}
```

### 2) `RulesDrawer.tsx` 핵심 검색 필터 및 아코디언 뷰어 로직
```typescript
const RulesDrawer = ({ isOpen, onClose }: RulesDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1]); // 1장 기본 오픈

  // 1. 회칙 통합 검색 매치 필터링 (useMemo 활용)
  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return rulesData;

    return rulesData
      .map((chapter) => {
        const matchedArticles = chapter.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { ...chapter, articles: matchedArticles };
      })
      .filter((chapter) => chapter.articles.length > 0);
  }, [searchQuery]);

  // 2. 검색어가 있을 때는 매칭된 챕터들을 자동으로 모두 활짝 펼침
  const activeExpandedChapters = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return filteredRules.map((c) => c.id);
    }
    return expandedChapters;
  }, [searchQuery, filteredRules, expandedChapters]);

  // 🚨 React Hooks 룰 준수: 훅 정의부 아래에서 조기 반환 실행!
  if (!isOpen) return null;

  return (
    // 드로어 마크업 구현...
  );
};
```

### 3) `MembersTab.tsx` 검색어 타이핑 시 탭 필터링 우회 로직
```typescript
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // 1. 검색어 매치 검사 (이름, 직장, 역할, 연락처 통합 매칭)
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase());

      // 🚨 검색창에 타이핑하는 중에는 필터 칩 상태를 강제 우회하여 전체 매칭 노출
      if (searchQuery.trim() !== '') {
        return matchesSearch;
      }

      if (!matchesSearch) return false;

      // 2. 검색어가 없을 때만 선택된 탭 필터 칩 적용
      if (activeFilter === '전체') return true;
      if (activeFilter === '회장단') return member.role.includes('회장');
      // ... (나머지 필터 칩 규칙 연동)
    });
  }, [members, searchQuery, activeFilter]);
```
