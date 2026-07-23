import React, { useRef } from 'react';
import type { Member } from './MembersTab';

interface MemberDetailProps {
  member: Member | null;
  onClose: () => void;
  onUpdateMember: (updatedMember: Member) => void;
}

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

const MemberDetail: React.FC<MemberDetailProps> = ({ member, onClose, onUpdateMember }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!member) return null;

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;

    // 1. 휴대폰 번호 뒤 4자리 비밀번호 검증
    const phoneDigits = member.phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 4) {
      alert("전화번호 형식이 올바르지 않아 본인 확인을 진행할 수 없습니다.");
      return;
    }
    const lastFourDigits = phoneDigits.slice(-4);

    const userInput = window.prompt("본인 확인을 위해 회원의 휴대전화 번호 뒤 4자리를 입력해주세요:");
    if (userInput === null) return; // 취소

    if (userInput !== lastFourDigits) {
      alert("비밀번호가 일치하지 않습니다. 이미지 업로드가 취소되었습니다.");
      e.target.value = '';
      return;
    }

    // 2. 이미지 압축 및 변환
    compressImage(file, 300, 300, 0.7)
      .then((compressedBase64) => {
        onUpdateMember({
          ...member,
          photo: compressedBase64
        });
        alert("프로필 이미지가 성공적으로 변경되었습니다.");
      })
      .catch((err) => {
        console.error("Image compression failed:", err);
        alert("이미지 처리 중 실패했습니다.");
      });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop animate-fade-in" onClick={onClose} />

      {/* Sheet Content */}
      <div className="drawer-content">
        <div className="drawer-handle" />
        
        <div className="drawer-header">
          <div 
            className="member-avatar drawer-avatar btn-interactive" 
            onClick={handleAvatarClick}
            style={{ 
              padding: 0, 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
            title="프로필 이미지 변경하려면 클릭"
          >
            {member.photo ? (
              <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              member.name.charAt(0)
            )}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              fontSize: '8px',
              padding: '2px 0',
              textAlign: 'center'
            }}>
              편집 ✏️
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="image/*" 
          />
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
