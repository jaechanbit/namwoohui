import React, { useState, useMemo } from 'react';
import type { Member } from './MembersTab';
import type { AttendanceSession, AttendanceRecord } from '../data/attendanceData';

interface AttendanceTabProps {
  members: Member[];
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  onAddSession: (title: string, date: string, isMutualAid: boolean) => void;
  onUpdateRecord: (memberId: number, sessionId: string, status: string) => void;
}

interface StatusSpec {
  label: string;
  bg: string;
  color: string;
  fontWeight: string;
  fontSize?: string;
}

const STATUS_DETAILS: Record<string, StatusSpec> = {
  'present': { label: '○', bg: 'rgba(15, 76, 58, 0.08)', color: 'var(--primary)', fontWeight: '900' },
  'mutual_aid': { label: '상주', bg: 'rgba(184, 134, 11, 0.08)', color: 'var(--accent)', fontWeight: '800', fontSize: '11px' },
  'absent': { label: 'X', bg: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', fontWeight: '800' },
  'pending': { label: '유보', bg: '#fffbeb', color: '#d97706', fontWeight: '800', fontSize: '11px' },
  '': { label: '-', bg: 'transparent', color: 'var(--text-muted)', fontWeight: '500' }
};

const AttendanceTab: React.FC<AttendanceTabProps> = ({
  members,
  sessions,
  records,
  onAddSession,
  onUpdateRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'mutual_aid'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newIsMutual, setNewIsMutual] = useState(false);

  // 1. Records map for quick lookup by member ID
  const recordsMap = useMemo(() => {
    const map = new Map<number, Record<string, string>>();
    records.forEach(r => {
      map.set(r.memberId, r.status);
    });
    return map;
  }, [records]);

  // 2. Filters
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (filterType === 'regular') return !s.is_mutual_aid;
      if (filterType === 'mutual_aid') return s.is_mutual_aid;
      return true;
    });
  }, [sessions, filterType]);

  const filteredMembers = useMemo(() => {
    return members
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.id - b.id);
  }, [members, searchTerm]);

  // 3. Stats
  const stats = useMemo(() => {
    const totalMembers = members.length;
    if (totalMembers === 0) return { avgRate: 0, totalAid: 0 };

    const regularSessions = sessions.filter(s => !s.is_mutual_aid);
    const aidSessions = sessions.filter(s => s.is_mutual_aid);

    let totalRegularAttendanceCount = 0;
    let totalRegularPossible = regularSessions.length * totalMembers;

    records.forEach(r => {
      regularSessions.forEach(s => {
        if (r.status[s.id] === 'present') {
          totalRegularAttendanceCount++;
        }
      });
    });

    const avgRate = totalRegularPossible > 0 
      ? Math.round((totalRegularAttendanceCount / totalRegularPossible) * 100) 
      : 0;

    const totalAidCount = aidSessions.length;

    return {
      avgRate,
      totalAid: totalAidCount
    };
  }, [members, sessions, records]);

  // 4. Click handler: cycling through states
  // order: '' -> 'present' -> 'mutual_aid' -> 'absent' -> 'pending' -> ''
  const handleCellClick = (memberId: number, sessionId: string) => {
    const currentStatus = (recordsMap.get(memberId) || {})[sessionId] || '';
    let nextStatus = '';
    
    if (currentStatus === '') {
      nextStatus = 'present';
    } else if (currentStatus === 'present') {
      nextStatus = 'mutual_aid';
    } else if (currentStatus === 'mutual_aid') {
      nextStatus = 'absent';
    } else if (currentStatus === 'absent') {
      nextStatus = 'pending';
    } else {
      nextStatus = '';
    }

    onUpdateRecord(memberId, sessionId, nextStatus);
  };

  const handleAddSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('항목 제목을 입력해주세요.');
      return;
    }
    onAddSession(newTitle, newDate, newIsMutual);
    setNewTitle('');
    setIsModalOpen(false);
  };

  const getCellStyles = (status: string) => {
    const detail = STATUS_DETAILS[status] || STATUS_DETAILS[''];
    return {
      backgroundColor: detail.bg,
      color: detail.color,
      fontWeight: detail.fontWeight,
      fontSize: detail.fontSize || 'inherit',
      cursor: 'pointer'
    };
  };

  const getCellLabel = (status: string) => {
    return (STATUS_DETAILS[status] || STATUS_DETAILS['']).label;
  };

  return (
    <div className="attendance-tab" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Dashboard Stats */}
      <div className="attendance-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div className="info-card glass" style={{ padding: '12px 10px', textAlign: 'center', borderRadius: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>전체 회원</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>{members.length}명</div>
        </div>
        <div className="info-card glass" style={{ padding: '12px 10px', textAlign: 'center', borderRadius: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>평균 출석률</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--accent)' }}>{stats.avgRate}%</div>
        </div>
        <div className="info-card glass" style={{ padding: '12px 10px', textAlign: 'center', borderRadius: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>상조 발생</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#2563eb' }}>{stats.totalAid}건</div>
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="attendance-controls" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="이름으로 검색.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#fff'
            }}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-interactive"
            style={{
              padding: '0 16px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            항목 추가
          </button>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'regular', 'mutual_aid'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className="btn-interactive"
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: filterType === type ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                color: filterType === type ? 'white' : 'var(--text-main)'
              }}
            >
              {type === 'all' && '전체 보기'}
              {type === 'regular' && '정기모임'}
              {type === 'mutual_aid' && '상조'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Attendance Table */}
      <div 
        className="info-card glass" 
        style={{ 
          padding: '0', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          border: '1px solid var(--border-color)' 
        }}
      >
        <div 
          className="table-scroll-container" 
          style={{ 
            overflowX: 'auto', 
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          <table 
            style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              fontSize: '12px',
              textAlign: 'center',
              minWidth: '380px'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--primary-light)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 6px', fontWeight: 800, width: '40px', color: 'var(--primary-dark)' }}>번호</th>
                <th style={{ padding: '12px 8px', fontWeight: 800, width: '70px', color: 'var(--primary-dark)', textAlign: 'left', position: 'sticky', left: 0, backgroundColor: 'var(--primary-light)', zIndex: 1 }}>이름</th>
                {filteredSessions.map(session => (
                  <th 
                    key={session.id} 
                    style={{ 
                      padding: '12px 6px', 
                      fontWeight: 800, 
                      color: session.is_mutual_aid ? 'var(--accent)' : 'var(--primary)',
                      minWidth: '60px'
                    }}
                  >
                    <div>{session.title}</div>
                    <div style={{ fontSize: '9px', opacity: 0.6, fontWeight: 500 }}>{session.date.substring(5)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const memberStatus = recordsMap.get(member.id) || {};
                return (
                  <tr 
                    key={member.id} 
                    style={{ 
                      borderBottom: '1px solid rgba(15, 76, 58, 0.04)',
                      transition: 'background-color 0.2s'
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '10px 4px', color: 'var(--text-muted)', fontWeight: 500 }}>{member.id}</td>
                    <td 
                      style={{ 
                        padding: '10px 8px', 
                        fontWeight: 700, 
                        textAlign: 'left',
                        position: 'sticky', 
                        left: 0, 
                        backgroundColor: '#fff',
                        zIndex: 1,
                        boxShadow: '2px 0 5px rgba(0,0,0,0.02)'
                      }}
                    >
                      {member.name}
                    </td>
                    {filteredSessions.map(session => {
                      const status = memberStatus[session.id] || '';
                      return (
                        <td
                          key={session.id}
                          onClick={() => handleCellClick(member.id, session.id)}
                          style={{
                            padding: '10px 4px',
                            transition: 'all 0.1s',
                            ...getCellStyles(status)
                          }}
                          className="btn-interactive"
                        >
                          {getCellLabel(status)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={filteredSessions.length + 2} style={{ padding: '24px', color: 'var(--text-muted)' }}>
                    일치하는 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
        💡 셀을 터치하면 [ <b>○</b> ➔ <b>상주</b> ➔ <b>X</b> ➔ <b>유보</b> ➔ <b>공란(-)</b> ] 순으로 변경됩니다.
      </div>

      {/* 4. Add Session Modal */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px'
          }}
        >
          <div 
            className="info-card glass" 
            style={{ 
              width: '100%', 
              maxWidth: '340px', 
              padding: '24px', 
              borderRadius: '16px',
              backgroundColor: 'white',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '16px', color: 'var(--primary)' }}>
              새 출석 항목 추가
            </h3>
            <form onSubmit={handleAddSessionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>구분</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="session_type" 
                      checked={!newIsMutual} 
                      onChange={() => setNewIsMutual(false)} 
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    정기모임
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="session_type" 
                      checked={newIsMutual} 
                      onChange={() => setNewIsMutual(true)} 
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    상조
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>항목 제목</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="예: 9월 정기모임, 상조(김동부)" 
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>일자</label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)} 
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AttendanceTab;
