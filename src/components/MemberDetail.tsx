import React from 'react';
import type { Member } from './MembersTab';

interface MemberDetailProps {
  member: Member | null;
  onClose: () => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop animate-fade-in" onClick={onClose} />

      {/* Sheet Content */}
      <div className="drawer-content">
        <div className="drawer-handle" />
        
        <div className="drawer-header">
          <div className="member-avatar drawer-avatar" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {member.photo ? (
              <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              member.name.charAt(0)
            )}
          </div>
          <button className="drawer-close btn-interactive" onClick={onClose} aria-label="닫기">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          <div className="detail-row">
            <span className="detail-label">이름</span>
            <span className="detail-value">{member.name}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">모임 직책</span>
            <span className="detail-value">{member.role || '일반 회원'}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">소속 / 직업</span>
            <span className="detail-value">{member.company || '정보 없음'}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">연락처</span>
            <span className="detail-value" style={{ fontFamily: 'var(--font-eng)' }}>{member.phone}</span>
          </div>
        </div>

        {/* 큼지막한 모바일 액션 버튼 */}
        <div className="drawer-actions-full">
          <a
            href={`tel:${member.phone}`}
            className="btn-large call btn-interactive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 01-4.706-4.706c-.154-.441.012-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            전화 걸기
          </a>
          <a
            href={`sms:${member.phone}`}
            className="btn-large sms btn-interactive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 4.75 4.75 0 003.433-.908 4.385 4.385 0 001.631.302c.046 0 .092-.002.138-.005z" />
            </svg>
            문자 보내기
          </a>
        </div>
      </div>
    </>
  );
};

export default MemberDetail;
