import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Member, BankAccount } from './MembersTab';
import type { MeetingSchedule } from './ScheduleTab';

const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface AdminTabProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: number) => void;

  schedules: MeetingSchedule[];
  onAddSchedule: (schedule: Omit<MeetingSchedule, 'id'>) => void;
  onUpdateSchedule: (schedule: MeetingSchedule) => void;
  onDeleteSchedule: (id: number) => void;

  accounts: BankAccount[];
  onUpdateAccounts: (updatedAccounts: BankAccount[]) => void;
  onAssignExecutive: (role: '회장' | '총무' | '재무', targetMemberId: number) => void;

  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const AdminTab: React.FC<AdminTabProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  accounts,
  onUpdateAccounts,
  onAssignExecutive,
  isAdmin,
  setIsAdmin
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 관리자 서브 탭 상태 (친구 관리 vs 일정 관리 vs 통장/집행부 설정)
  const [subTab, setSubTab] = useState<'members' | 'schedules' | 'settings'>('members');

  // 친구 CRUD 모달 상태
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState<'add' | 'edit'>('add');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    role: '',
    company: '',
    phone: '',
    photo: ''
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

  // 통장 정보 로컬 상태
  const membershipAccount = accounts.find(a => a.type === 'membership') || {
    id: 1, type: 'membership' as const, bank_name: '국민은행', account_number: '000000-00-000000', owner: '남우회'
  };
  const mutualAidAccount = accounts.find(a => a.type === 'mutual_aid') || {
    id: 2, type: 'mutual_aid' as const, bank_name: '농협은행', account_number: '000-0000-0000-00', owner: '남우회'
  };

  const [bankFormData, setBankFormData] = useState({
    membershipBank: membershipAccount.bank_name,
    membershipNo: membershipAccount.account_number,
    membershipOwner: membershipAccount.owner,
    mutualAidBank: mutualAidAccount.bank_name,
    mutualAidNo: mutualAidAccount.account_number,
    mutualAidOwner: mutualAidAccount.owner
  });

  // 집행부 로컬 선택 상태 (회원 id)
  const currentPresident = members.find(m => m.role === '회장')?.id || 0;
  const currentSecretary = members.find(m => m.role === '총무')?.id || 0;
  const currentTreasurer = members.find(m => m.role === '재무')?.id || 0;

  const [execSelection, setExecSelection] = useState({
    presidentId: currentPresident,
    secretaryId: currentSecretary,
    treasurerId: currentTreasurer
  });

  // 전화번호 중복 체크를 위한 계산 변수
  const cleanPhone = memberFormData.phone.replace(/[^0-9]/g, '');
  const isPhoneDuplicate = cleanPhone.length > 0 && members.some(m => {
    // 수정 모드일 때는 자기 자신은 중복 체크에서 제외
    if (memberModalMode === 'edit' && selectedMember && m.id === selectedMember.id) {
      return false;
    }
    return m.phone.replace(/[^0-9]/g, '') === cleanPhone;
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const adminPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';
    
    if (hashHex === adminPasswordHash) {
      setIsAdmin(true);
      setErrorMsg('');
    } else {
      setErrorMsg('비밀번호가 올바르지 않습니다.');
    }
  };

  // 친구 모달 핸들러
  const openAddMemberModal = () => {
    setMemberModalMode('add');
    setMemberFormData({ name: '', role: '', company: '', phone: '', photo: '' });
    setIsMemberModalOpen(true);
  };

  const openEditMemberModal = (member: Member) => {
    setMemberModalMode('edit');
    setSelectedMember(member);
    setMemberFormData({
      name: member.name,
      role: member.role,
      company: member.company,
      phone: member.phone,
      photo: member.photo || ''
    });
    setIsMemberModalOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('이미지 크기는 10MB 이하여야 합니다.');
        return;
      }
      compressImage(file, 300, 300, 0.7)
        .then((compressedBase64) => {
          setMemberFormData((prev) => ({ ...prev, photo: compressedBase64 }));
        })
        .catch((err) => {
          console.error("Image compression error:", err);
          alert("이미지 압축 처리 중 실패했습니다.");
        });
    }
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFormData.name.trim() || !memberFormData.phone.trim()) {
      alert('이름과 전화번호는 필수 입력 항목입니다.');
      return;
    }
    if (isPhoneDuplicate) {
      alert('이미 등록된 전화번호입니다.');
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

  // 통장 설정 저장
  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BankAccount[] = [
      {
        id: membershipAccount.id,
        type: 'membership',
        bank_name: bankFormData.membershipBank,
        account_number: bankFormData.membershipNo,
        owner: bankFormData.membershipOwner
      },
      {
        id: mutualAidAccount.id,
        type: 'mutual_aid',
        bank_name: bankFormData.mutualAidBank,
        account_number: bankFormData.mutualAidNo,
        owner: bankFormData.mutualAidOwner
      }
    ];
    onUpdateAccounts(updated);
  };

  // 집행부 개별 임명
  const handleAssignRole = (role: '회장' | '총무' | '재무', targetId: number) => {
    if (targetId === 0) {
      alert('올바른 회원을 선택해주세요.');
      return;
    }
    const memberName = members.find(m => m.id === targetId)?.name;
    if (window.confirm(`${memberName} 회원을 새로운 '${role}'(으)로 임명하시겠습니까?`)) {
      onAssignExecutive(role, targetId);
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-auth-container glass animate-fade-in" style={{ borderRadius: 'var(--radius-md)' }}>
        <img src="/namwoohui/logo.png" alt="남우회 로고" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '8px' }} />
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>관리자 모드 접속</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>친구, 일정, 통장 및 집행부를 관리할 수 있습니다.</p>
        </div>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="password"
            className="input-field"
            placeholder="비밀번호를 입력하세요."
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
      {/* 서브 탭 스위처 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', background: 'var(--background)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setSubTab('members')}
          style={{
            padding: '8px 0',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: subTab === 'members' ? 'var(--primary)' : 'transparent',
            color: subTab === 'members' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
        >
          친구 정보
        </button>
        <button
          onClick={() => setSubTab('schedules')}
          style={{
            padding: '8px 0',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: subTab === 'schedules' ? 'var(--primary)' : 'transparent',
            color: subTab === 'schedules' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
        >
          모임 일정
        </button>
        <button
          onClick={() => setSubTab('settings')}
          style={{
            padding: '8px 0',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: subTab === 'settings' ? 'var(--primary)' : 'transparent',
            color: subTab === 'settings' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
        >
          통장/집행부
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

      {/* 3. 통장 및 집행부 지정 세션 */}
      {subTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 집행부 임명 폼 */}
          <div className="info-card">
            <h3 className="info-title" style={{ fontSize: '15px' }}>집행부 임명 관리</h3>
            
            <div className="form-group" style={{ marginTop: '10px' }}>
              <label>회장 임명</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="input-field" 
                  value={execSelection.presidentId} 
                  onChange={(e) => setExecSelection({ ...execSelection, presidentId: Number(e.target.value) })}
                >
                  <option value={0}>선택 안함 (공석)</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.company || '소속없음'})</option>)}
                </select>
                <button 
                  className="btn-primary btn-interactive" 
                  style={{ width: 'auto', padding: '0 16px', fontSize: '13px' }}
                  onClick={() => handleAssignRole('회장', execSelection.presidentId)}
                >
                  임명
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label>총무 임명</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="input-field" 
                  value={execSelection.secretaryId} 
                  onChange={(e) => setExecSelection({ ...execSelection, secretaryId: Number(e.target.value) })}
                >
                  <option value={0}>선택 안함 (공석)</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.company || '소속없음'})</option>)}
                </select>
                <button 
                  className="btn-primary btn-interactive" 
                  style={{ width: 'auto', padding: '0 16px', fontSize: '13px' }}
                  onClick={() => handleAssignRole('총무', execSelection.secretaryId)}
                >
                  임명
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label>재무 임명</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="input-field" 
                  value={execSelection.treasurerId} 
                  onChange={(e) => setExecSelection({ ...execSelection, treasurerId: Number(e.target.value) })}
                >
                  <option value={0}>선택 안함 (공석)</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.company || '소속없음'})</option>)}
                </select>
                <button 
                  className="btn-primary btn-interactive" 
                  style={{ width: 'auto', padding: '0 16px', fontSize: '13px' }}
                  onClick={() => handleAssignRole('재무', execSelection.treasurerId)}
                >
                  임명
                </button>
              </div>
            </div>
          </div>

          {/* 통장 정보 설정 폼 */}
          <form onSubmit={handleBankSubmit} className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 className="info-title" style={{ fontSize: '15px' }}>공식 통장 정보 설정</h3>
            
            {/* 회비 통장 */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>회비 통장 설정</span>
              <div className="form-group">
                <label>은행명</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  value={bankFormData.membershipBank}
                  onChange={(e) => setBankFormData({ ...bankFormData, membershipBank: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>계좌번호</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  value={bankFormData.membershipNo}
                  onChange={(e) => setBankFormData({ ...bankFormData, membershipNo: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>예금주</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  value={bankFormData.membershipOwner}
                  onChange={(e) => setBankFormData({ ...bankFormData, membershipOwner: e.target.value })}
                />
              </div>
            </div>

            {/* 상조 통장 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#765d3d' }}>상조 통장 설정</span>
              <div className="form-group">
                <label>은행명</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  value={bankFormData.mutualAidBank}
                  onChange={(e) => setBankFormData({ ...bankFormData, mutualAidBank: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>계좌번호</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  value={bankFormData.mutualAidNo}
                  onChange={(e) => setBankFormData({ ...bankFormData, mutualAidNo: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>예금주</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  value={bankFormData.mutualAidOwner}
                  onChange={(e) => setBankFormData({ ...bankFormData, mutualAidOwner: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary btn-interactive" style={{ marginTop: '6px' }}>
              통장 정보 저장
            </button>
          </form>
        </div>
      )}

      {/* 친구 CRUD 모달 */}
      {isMemberModalOpen && createPortal(
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
              <label>직책 (예: 부회장, 운영위원, 상조위원 등)</label>
              <input
                type="text"
                className="input-field"
                placeholder="회장/총무/재무는 상단 설정탭을 이용해주세요"
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
                className={`input-field ${isPhoneDuplicate ? 'error' : ''}`}
                required
                placeholder="010-0000-0000"
                value={memberFormData.phone}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  // 자동으로 하이픈 적용
                  const clean = rawValue.replace(/[^0-9]/g, '');
                  let formatted = clean;
                  if (clean.length > 3 && clean.length <= 7) {
                    formatted = `${clean.slice(0, 3)}-${clean.slice(3)}`;
                  } else if (clean.length > 7) {
                    formatted = `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
                  }
                  setMemberFormData({ ...memberFormData, phone: formatted });
                }}
              />
              {isPhoneDuplicate && (
                <span className="error-message" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  ⚠️ 이미 등록된 전화번호입니다.
                </span>
              )}
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label>회원 사진</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  flexShrink: 0
                }}>
                  {memberFormData.photo ? (
                    <img src={memberFormData.photo} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="photo-upload"
                    style={{ display: 'none' }}
                    onChange={handlePhotoChange}
                  />
                  <label htmlFor="photo-upload" className="btn-secondary btn-interactive" style={{ margin: 0, fontSize: '13px', padding: '6px 12px', cursor: 'pointer', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
                    사진 선택
                  </label>
                  {memberFormData.photo && (
                    <button
                      type="button"
                      onClick={() => setMemberFormData({ ...memberFormData, photo: '' })}
                      style={{ fontSize: '12px', background: 'transparent', border: 'none', color: 'hsl(0, 85%, 45%)', cursor: 'pointer', fontWeight: 500 }}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button type="button" className="btn-secondary" onClick={() => setIsMemberModalOpen(false)}>
                취소
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ 
                  width: 'auto',
                  opacity: isPhoneDuplicate ? 0.6 : 1,
                  cursor: isPhoneDuplicate ? 'not-allowed' : 'pointer'
                }} 
                disabled={isPhoneDuplicate}
              >
                저장
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* 일정 CRUD 모달 */}
      {isScheduleModalOpen && createPortal(
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminTab;
