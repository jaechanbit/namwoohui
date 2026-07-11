import React, { useState } from 'react';
import type { Member } from './MembersTab';
import type { MeetingSchedule } from './ScheduleTab';

interface AdminTabProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: number) => void;

  // 모임 일정 관리 관련 추가
  schedules: MeetingSchedule[];
  onAddSchedule: (schedule: Omit<MeetingSchedule, 'id'>) => void;
  onUpdateSchedule: (schedule: MeetingSchedule) => void;
  onDeleteSchedule: (id: number) => void;
}

const AdminTab: React.FC<AdminTabProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 관리자 서브 탭 상태 (친구 관리 vs 일정 관리)
  const [subTab, setSubTab] = useState<'members' | 'schedules'>('members');

  // 친구 CRUD 모달 상태
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState<'add' | 'edit'>('add');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    role: '',
    company: '',
    phone: ''
  });

  // 일정 CRUD 모달 상태
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalMode, setScheduleModalMode] = useState<'add' | 'edit'>('add');
  const [selectedSchedule, setSelectedSchedule] = useState<MeetingSchedule | null>(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    title: '',
    date: '',
    location: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('비밀번호가 올바르지 않습니다. (테스트용: 1234)');
    }
  };

  // 친구 모달 핸들러
  const openAddMemberModal = () => {
    setMemberModalMode('add');
    setMemberFormData({ name: '', role: '', company: '', phone: '' });
    setIsMemberModalOpen(true);
  };

  const openEditMemberModal = (member: Member) => {
    setMemberModalMode('edit');
    setSelectedMember(member);
    setMemberFormData({
      name: member.name,
      role: member.role,
      company: member.company,
      phone: member.phone
    });
    setIsMemberModalOpen(true);
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFormData.name.trim() || !memberFormData.phone.trim()) {
      alert('이름과 전화번호는 필수 입력 항목입니다.');
      return;
    }
    if (memberModalMode === 'add') {
      onAddMember(memberFormData);
    } else if (memberModalMode === 'edit' && selectedMember) {
      onUpdateMember({ ...selectedMember, ...memberFormData });
    }
    setIsMemberModalOpen(false);
  };

  // 일정 모달 핸들러
  const openAddScheduleModal = () => {
    setScheduleModalMode('add');
    setScheduleFormData({ title: '', date: '', location: '' });
    setIsScheduleModalOpen(true);
  };

  const openEditScheduleModal = (schedule: MeetingSchedule) => {
    setScheduleModalMode('edit');
    setSelectedSchedule(schedule);
    setScheduleFormData({
      title: schedule.title,
      date: schedule.date,
      location: schedule.location || ''
    });
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleFormData.title.trim() || !scheduleFormData.date) {
      alert('제목과 날짜는 필수 입력 항목입니다.');
      return;
    }
    if (scheduleModalMode === 'add') {
      onAddSchedule(scheduleFormData);
    } else if (scheduleModalMode === 'edit' && selectedSchedule) {
      onUpdateSchedule({ ...selectedSchedule, ...scheduleFormData });
    }
    setIsScheduleModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-auth-container glass animate-fade-in" style={{ borderRadius: 'var(--radius-md)' }}>
        <div className="admin-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '32px', height: '32px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>관리자 모드 접속</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>친구 및 일정을 관리할 수 있습니다.</p>
        </div>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="password"
            className="input-field"
            placeholder="비밀번호 입력 (테스트: 1234)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMsg && <p style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 500 }}>{errorMsg}</p>}
          <button type="submit" className="btn-primary btn-interactive">인증하기</button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 안내 메시지 카드 */}
      <div className="info-card" style={{ padding: '12px 16px', background: 'var(--primary-light)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          수정된 모든 정보는 수파베이스 DB에 실시간으로 반영됩니다.
        </p>
      </div>

      {/* 서브 탭 스위처 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--background)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setSubTab('members')}
          style={{
            padding: '10px 0',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            background: subTab === 'members' ? 'var(--primary)' : 'transparent',
            color: subTab === 'members' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
        >
          친구 정보 관리
        </button>
        <button
          onClick={() => setSubTab('schedules')}
          style={{
            padding: '10px 0',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            background: subTab === 'schedules' ? 'var(--primary)' : 'transparent',
            color: subTab === 'schedules' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
        >
          모임 일정 관리
        </button>
      </div>

      {/* 1. 친구 정보 관리 세션 */}
      {subTab === 'members' && (
        <>
          <div className="admin-controls">
            <span className="admin-list-header">전체 친구 목록 ({members.length}명)</span>
            <button className="btn-primary btn-interactive" onClick={openAddMemberModal} style={{ width: 'auto', padding: '8px 14px', borderRadius: 'var(--radius-sm)' }}>
              + 친구 추가
            </button>
          </div>

          <div className="members-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {members.map((member) => (
              <div key={member.id} className="member-card" style={{ cursor: 'default' }}>
                <div className="member-info-wrapper">
                  <div className="member-avatar">{member.name.charAt(0)}</div>
                  <div className="member-text">
                    <div className="member-name-row">
                      <span className="member-name">{member.name}</span>
                      {member.role && <span className="member-role-badge">{member.role}</span>}
                    </div>
                    <span className="member-company">{member.company || '정보 없음'}</span>
                  </div>
                </div>
                <div className="member-actions">
                  <button
                    className="action-btn edit-btn btn-interactive"
                    onClick={() => openEditMemberModal(member)}
                    aria-label="정보 수정"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 20.013a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    className="action-btn delete-btn btn-interactive"
                    onClick={() => {
                      if (window.confirm(`정말 ${member.name} 회원을 삭제하시겠습니까?`)) {
                        onDeleteMember(member.id);
                      }
                    }}
                    aria-label="삭제"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 2. 모임 일정 관리 세션 */}
      {subTab === 'schedules' && (
        <>
          <div className="admin-controls">
            <span className="admin-list-header">전체 일정 목록 ({schedules.length}개)</span>
            <button className="btn-primary btn-interactive" onClick={openAddScheduleModal} style={{ width: 'auto', padding: '8px 14px', borderRadius: 'var(--radius-sm)' }}>
              + 모임 일정 추가
            </button>
          </div>

          <div className="members-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {schedules.map((schedule) => (
              <div key={schedule.id} className="member-card" style={{ cursor: 'default' }}>
                <div className="member-info-wrapper">
                  <div className="member-avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>일</div>
                  <div className="member-text">
                    <div className="member-name-row">
                      <span className="member-name" style={{ fontSize: '15px' }}>{schedule.title}</span>
                    </div>
                    <span className="member-company">
                      날짜: {schedule.date} | 장소: {schedule.location || '추후 공지'}
                    </span>
                  </div>
                </div>
                <div className="member-actions">
                  <button
                    className="action-btn edit-btn btn-interactive"
                    onClick={() => openEditScheduleModal(schedule)}
                    aria-label="일정 수정"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 20.013a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    className="action-btn delete-btn btn-interactive"
                    onClick={() => {
                      if (window.confirm(`정말 '${schedule.title}' 일정을 삭제하시겠습니까?`)) {
                        onDeleteSchedule(schedule.id);
                      }
                    }}
                    aria-label="삭제"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 친구 CRUD 모달 */}
      {isMemberModalOpen && (
        <div className="modal-backdrop animate-fade-in">
          <form onSubmit={handleMemberSubmit} className="modal-content">
            <h3 className="modal-title">
              {memberModalMode === 'add' ? '새로운 친구 등록' : '회원 정보 수정'}
            </h3>

            <div className="form-group">
              <label>이름 *</label>
              <input
                type="text"
                className="input-field"
                required
                value={memberFormData.name}
                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>직책 (예: 회장, 운영위원, 총무 등)</label>
              <input
                type="text"
                className="input-field"
                placeholder="공란 입력 시 일반회원"
                value={memberFormData.role}
                onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>소속 / 직업</label>
              <input
                type="text"
                className="input-field"
                value={memberFormData.company}
                onChange={(e) => setMemberFormData({ ...memberFormData, company: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>전화번호 *</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="010-0000-0000"
                value={memberFormData.phone}
                onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
              />
            </div>

            <div className="modal-buttons">
              <button type="button" className="btn-secondary" onClick={() => setIsMemberModalOpen(false)}>
                취소
              </button>
              <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                저장
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 일정 CRUD 모달 */}
      {isScheduleModalOpen && (
        <div className="modal-backdrop animate-fade-in">
          <form onSubmit={handleScheduleSubmit} className="modal-content">
            <h3 className="modal-title">
              {scheduleModalMode === 'add' ? '새 모임 일정 추가' : '모임 일정 수정'}
            </h3>

            <div className="form-group">
              <label>모임 제목 *</label>
              <input
                type="text"
                className="input-field"
                placeholder="예: 3월 정기 모임, 임시 야유회"
                required
                value={scheduleFormData.title}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>모임 날짜 *</label>
              <input
                type="date"
                className="input-field"
                required
                value={scheduleFormData.date}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>2부 식사 장소 (공란 입력 시 '추후 공지')</label>
              <input
                type="text"
                className="input-field"
                placeholder="예: 백제갈비, 궁 식당"
                value={scheduleFormData.location}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, location: e.target.value })}
              />
            </div>

            <div className="modal-buttons">
              <button type="button" className="btn-secondary" onClick={() => setIsScheduleModalOpen(false)}>
                취소
              </button>
              <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminTab;
