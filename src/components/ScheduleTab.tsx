import React, { useMemo } from 'react';

export interface MeetingSchedule {
  id: number;
  title: string;
  date: string; // "YYYY-MM-DD"
  location?: string;
  created_at?: string;
}

interface ScheduleTabProps {
  schedules: MeetingSchedule[];
}

// 특정 년도, 특정 월(0-indexed)의 첫째 주 토요일을 구하는 헬퍼 함수 (Fallback용)
const getFirstSaturday = (year: number, month: number): Date => {
  const date = new Date(year, month, 1);
  const day = date.getDay(); // 0(일) ~ 6(토)
  const diff = (6 - day + 7) % 7;
  date.setDate(1 + diff);
  date.setHours(19, 0, 0, 0); // 19시 정각
  return date;
};

// 다음 다가오는 모임 일정과 D-Day를 계산하는 함수
const getNextMeeting = (now: Date, dbSchedules: MeetingSchedule[]) => {
  // DB에 유효한 미래의 일정이 있는 경우
  const futureDbSchedules = dbSchedules
    .map(s => ({
      date: new Date(`${s.date}T19:00:00`),
      name: s.title,
      dinnerLocation: s.location || '추후 공지'
    }))
    .filter(s => s.date.getTime() > now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (futureDbSchedules.length > 0) {
    const next = futureDbSchedules[0];
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
    return {
      name: next.name,
      dday: diffDays,
      formattedDate: next.date.toLocaleDateString('ko-KR', options),
      meetingLocation: '남원중앙새마을금고 3층',
      dinnerLocation: next.dinnerLocation
    };
  }

  // DB에 일정이 없을 때 기존 정기 규정(Fallback)으로 계산
  const currentYear = now.getFullYear();
  const meetingMonths = [2, 5, 8, 10, 11]; // 3월(2), 6월(5), 9월(8), 11월(10), 12월(11)
  const candidateMeetings: { date: Date; name: string }[] = [];

  [currentYear, currentYear + 1].forEach((year) => {
    meetingMonths.forEach((month) => {
      const date = getFirstSaturday(year, month);
      const name = month === 11 ? '정기총회 및 모임' : '정기 모임';
      candidateMeetings.push({ date, name });
    });
  });

  const next = candidateMeetings.find((m) => m.date.getTime() > now.getTime());

  if (!next) {
    return {
      name: '정기 모임',
      dday: 0,
      formattedDate: '',
      meetingLocation: '남원중앙새마을금고 3층',
      dinnerLocation: '추후 공지'
    };
  }

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

  return {
    name: next.name,
    dday: diffDays,
    formattedDate: next.date.toLocaleDateString('ko-KR', options),
    meetingLocation: '남원중앙새마을금고 3층',
    dinnerLocation: '추후 공지'
  };
};

const ScheduleTab: React.FC<ScheduleTabProps> = ({ schedules }) => {
  const now = useMemo(() => new Date(), []);
  const nextMeeting = useMemo(() => getNextMeeting(now, schedules), [now, schedules]);

  // 오늘 이후 미래의 모든 모임 목록 정렬
  const upcomingSchedules = useMemo(() => {
    return [...schedules]
      .filter(s => new Date(`${s.date}T23:59:59`).getTime() > now.getTime())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [schedules, now]);

  return (
    <div className="schedule-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* D-Day Widget */}
      <div className="dday-card">
        <span className="dday-badge">NEXT MEETING</span>
        <h2 className="dday-number">
          {nextMeeting.dday === 0 ? 'D-Day 바로 오늘!' : `D-${nextMeeting.dday}`}
        </h2>
        <div className="dday-info">
          <p style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>
            {nextMeeting.name}
          </p>
          <p style={{ opacity: 0.9, fontSize: '13px' }}>{nextMeeting.formattedDate}</p>
        </div>
      </div>

      {/* 장소 및 지도 연동 */}
      <div className="info-card">
        <h3 className="info-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
          </svg>
          모임 상세 장소
        </h3>
        
        {/* 회의 장소 (고정) */}
        <div className="info-item">
          <span className="info-label">1부 회의</span>
          <span className="info-value" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            {nextMeeting.meetingLocation}
          </span>
        </div>
        <div className="map-btn-container" style={{ marginTop: '8px', marginBottom: '14px', gridTemplateColumns: '1fr 1fr' }}>
          <a
            href={`https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent('남원중앙새마을금고')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link btn-interactive"
            style={{ fontSize: '12px', padding: '6px' }}
          >
            회의 장소 네이버 지도
          </a>
          <a
            href={`https://map.kakao.com/?q=${encodeURIComponent('남원중앙새마을금고')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link btn-interactive"
            style={{ fontSize: '12px', padding: '6px' }}
          >
            회의 장소 카카오 맵
          </a>
        </div>

        {/* 식사 장소 (동적) */}
        <div className="info-item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <span className="info-label">2부 식사</span>
          <span className="info-value" style={{ fontWeight: 700, color: nextMeeting.dinnerLocation === '추후 공지' ? 'var(--text-muted)' : 'var(--primary)' }}>
            {nextMeeting.dinnerLocation}
          </span>
        </div>

        {nextMeeting.dinnerLocation && nextMeeting.dinnerLocation !== '추후 공지' && (
          <div className="map-btn-container" style={{ marginTop: '10px' }}>
            <a
              href={`https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent('남원 ' + nextMeeting.dinnerLocation)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link btn-interactive"
              style={{ fontSize: '12px', padding: '6px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
            >
              식사 장소 네이버 지도
            </a>
            <a
              href={`https://map.kakao.com/?q=${encodeURIComponent('남원 ' + nextMeeting.dinnerLocation)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link btn-interactive"
              style={{ fontSize: '12px', padding: '6px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
            >
              식사 장소 카카오 맵
            </a>
          </div>
        )}
      </div>

      {/* 등록된 다가올 모임 전체 리스트 */}
      <div className="info-card">
        <h3 className="info-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          등록된 모임 일정 ({upcomingSchedules.length}개)
        </h3>
        
        {upcomingSchedules.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
            새로 등록된 특별 일정이 없습니다.<br/>(기본 정기 일정으로 작동 중)
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {upcomingSchedules.map((schedule) => {
              const sDate = new Date(`${schedule.date}T19:00:00`);
              const dTime = sDate.getTime() - now.getTime();
              const dDays = Math.ceil(dTime / (1000 * 60 * 60 * 24));
              
              return (
                <div key={schedule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>{schedule.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      회의: 남원중앙새마을금고 3층 | 식사: {schedule.location || '추후 공지'}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '10px' }}>
                    {dDays === 0 ? 'D-Day' : `D-${dDays}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 모임 기본 규정 */}
      <div className="info-card">
        <h3 className="info-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          남우회 정기 모임 규정
        </h3>
        <div className="info-item">
          <span className="info-label">정기모임</span>
          <span className="info-value">매년 3, 6, 9, 11월 첫째 주 토요일 (19:00)</span>
        </div>
        <div className="info-item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <span className="info-label">정기총회</span>
          <span className="info-value">매년 12월 첫째 주 토요일 (19:00)</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
