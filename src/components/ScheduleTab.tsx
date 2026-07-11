import React, { useMemo } from 'react';

// 특정 년도, 특정 월(0-indexed)의 첫째 주 토요일을 구하는 헬퍼 함수
const getFirstSaturday = (year: number, month: number): Date => {
  const date = new Date(year, month, 1);
  const day = date.getDay(); // 0(일) ~ 6(토)
  const diff = (6 - day + 7) % 7;
  date.setDate(1 + diff);
  date.setHours(19, 0, 0, 0); // 19시 정각
  return date;
};

// 다음 다가오는 모임 일정과 D-Day를 계산하는 함수
const getNextMeeting = (now: Date) => {
  const currentYear = now.getFullYear();
  const meetingMonths = [2, 5, 8, 10, 11]; // 3월(2), 6월(5), 9월(8), 11월(10), 12월(11)

  const candidateMeetings: { date: Date; name: string }[] = [];

  // 올해와 내년 후보 일정 생성
  [currentYear, currentYear + 1].forEach((year) => {
    meetingMonths.forEach((month) => {
      const date = getFirstSaturday(year, month);
      const name = month === 11 ? '정기총회 및 모임' : '정기 모임';
      candidateMeetings.push({ date, name });
    });
  });

  // 오늘 이후의 첫 번째 모임 찾기
  const next = candidateMeetings.find((m) => m.date.getTime() > now.getTime());

  if (!next) {
    // 혹시 못 찾은 경우를 대비해 Fallback
    return {
      date: new Date(),
      name: '정기 모임',
      dday: 0,
      formattedDate: ''
    };
  }

  // D-Day 계산
  const diffTime = next.date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric'
  };
  const formattedDate = next.date.toLocaleDateString('ko-KR', options);

  return {
    date: next.date,
    name: next.name,
    dday: diffDays,
    formattedDate
  };
};

const ScheduleTab: React.FC = () => {
  const now = new Date();
  const nextMeeting = useMemo(() => getNextMeeting(now), []);

  return (
    <div className="schedule-container animate-fade-in">
      {/* D-Day Widget */}
      <div className="dday-card">
        <span className="dday-badge">NEXT MEETING</span>
        <h2 className="dday-number">
          {nextMeeting.dday === 0 ? 'D-Day 바로 오늘!' : `D-${nextMeeting.dday}`}
        </h2>
        <div className="dday-info">
          <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
            {nextMeeting.name}
          </p>
          <p style={{ opacity: 0.9 }}>{nextMeeting.formattedDate}</p>
        </div>
      </div>

      {/* 모임 규정 및 안내 */}
      <div className="info-card">
        <h3 className="info-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.985l-.04.022c-.296.216-.625.377-.98.478l-.107.03a.75.75 0 00-.544.712v.225a.75.75 0 001.5 0v-.071c.48-.11.935-.31 1.346-.597l.088-.063a2.25 2.25 0 10-3.322-2.914l-.066.089a.75.75 0 001.242.84l.067-.09z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          남우회 정기일정 규정
        </h3>
        <div className="info-item">
          <span className="info-label">정기모임</span>
          <span className="info-value">매년 3월, 6월, 9월, 11월 첫째 주 토요일 (19:00)</span>
        </div>
        <div className="info-item">
          <span className="info-label">정기총회</span>
          <span className="info-value">매년 12월 첫째 주 토요일 (19:00)</span>
        </div>
        <div className="info-item">
          <span className="info-label">회비 납부</span>
          <span className="info-value">총무 및 재무 문의</span>
        </div>
      </div>

      {/* 장소 및 지도 연동 */}
      <div className="info-card">
        <h3 className="info-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
          </svg>
          모임 장소 안내
        </h3>
        <div className="info-item">
          <span className="info-label">기본 장소</span>
          <span className="info-value">남원용성로타리클럽 2층</span>
        </div>
        <div className="info-item">
          <span className="info-label">상세 주소</span>
          <span className="info-value">전라북도 남원시 용성로 인근</span>
        </div>

        <div className="map-btn-container">
          <a
            href="https://m.map.naver.com/search2/search.naver?query=남원+용성로타리클럽"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link btn-interactive"
          >
            네이버 지도 보기
          </a>
          <a
            href="https://map.kakao.com/?q=남원+용성로타리클럽"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link btn-interactive"
          >
            카카오 맵 보기
          </a>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
