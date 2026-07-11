import React, { useState, useMemo } from 'react';

export interface Member {
  id: number;
  name: string;
  role: string;
  company: string;
  phone: string;
}

export interface BankAccount {
  id: number;
  type: 'membership' | 'mutual_aid';
  bank_name: string;
  account_number: string;
  owner: string;
}

interface MembersTabProps {
  members: Member[];
  accounts: BankAccount[];
  onSelectMember: (member: Member) => void;
}

const MembersTab: React.FC<MembersTabProps> = ({ members, accounts, onSelectMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');

  const filters = ['전체', '회장단', '운영진', '상조위원', '감사'];

  // 1. 통장 데이터 매핑 (DB 데이터 우선, 실패 시 기본값 폴백)
  const mappedAccounts = useMemo(() => {
    const findAccount = (type: 'membership' | 'mutual_aid') => {
      return accounts.find(a => a.type === type);
    };

    return {
      membership: findAccount('membership') || {
        bank_name: '국민은행',
        account_number: '000000-00-000000',
        owner: '남우회'
      },
      mutualAid: findAccount('mutual_aid') || {
        bank_name: '농협은행',
        account_number: '000-0000-0000-00',
        owner: '남우회'
      }
    };
  }, [accounts]);

  // 2. 집행부 정보 동적 추출 (회장, 총무, 재무)
  const executives = useMemo(() => {
    const findExec = (roleName: string) => {
      // 정확한 매칭을 시도하고, 없으면 부분 매칭 시도
      return members.find(m => m.role === roleName) || 
             members.find(m => m.role.includes(roleName) && !m.role.includes('부회장'));
    };

    return {
      president: findExec('회장'),
      secretary: findExec('총무'),
      treasurer: findExec('재무')
    };
  }, [members]);

  // 이름에서 닉네임 요약 (예: 정영구 -> 영구, 홍길동 -> 길동)
  const getNickname = (name: string) => {
    if (!name) return '?';
    if (name.length <= 2) return name;
    return name.substring(1);
  };

  const handleCopyAccount = (bankName: string, accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber)
      .then(() => alert(`${bankName} 계좌번호(${accountNumber})가 복사되었습니다.`))
      .catch(() => alert('복사에 실패했습니다. 수동으로 복사해주세요.'));
  };

  // 3. 각 필터별 인원수 계산 헬퍼 함수
  const getFilterCount = (filterName: string) => {
    return members.filter((member) => {
      if (filterName === '전체') return true;
      if (filterName === '회장단') {
        return member.role.includes('회장') && !member.role.includes('부회장');
      }
      if (filterName === '운영진') {
        return (
          member.role.includes('운영위원') ||
          member.role.includes('총무') ||
          member.role.includes('재무') ||
          member.role.includes('부회장')
        );
      }
      if (filterName === '상조위원') {
        return member.role.includes('상조위');
      }
      if (filterName === '감사') {
        return member.role.includes('감사');
      }
      return true;
    }).length;
  };

  // Filter & Search Logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // 1. Search Query Match
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.replace(/-/g, '').includes(searchQuery.replace(/-/g, ''));

      if (!matchesSearch) return false;

      // 2. Tab Filter Match
      if (activeFilter === '전체') return true;
      if (activeFilter === '회장단') {
        // 부회장은 제외
        return member.role.includes('회장') && !member.role.includes('부회장');
      }
      if (activeFilter === '운영진') {
        // 부회장은 운영진에 포함
        return (
          member.role.includes('운영위원') ||
          member.role.includes('총무') ||
          member.role.includes('재무') ||
          member.role.includes('부회장')
        );
      }
      if (activeFilter === '상조위원') {
        return member.role.includes('상조위');
      }
      if (activeFilter === '감사') {
        return member.role.includes('감사');
      }

      return true;
    });
  }, [members, searchQuery, activeFilter]);

  // Click call/sms prevention from bubbling to card detail click
  const handleActionClick = (e: React.MouseEvent, type: 'tel' | 'sms', phone: string) => {
    e.stopPropagation();
    window.location.href = `${type}:${phone}`;
  };

  return (
    <div className="animate-fade-in">
      {/* 남우회 공식 통장 섹션 */}
      <div className="account-section">
        <div className="account-header">
          <span className="account-title">남우회 공식 통장</span>
          <span className="account-subtitle">입금 시 성명을 적어주세요</span>
        </div>

        <div className="bank-card membership">
          <span className="bank-card-type">회비 통장</span>
          <span className="bank-card-name">{mappedAccounts.membership.bank_name}</span>
          <span className="bank-card-number">{mappedAccounts.membership.account_number}</span>
          <span className="bank-card-owner">예금주 {mappedAccounts.membership.owner}</span>
          <button 
            className="bank-copy-btn btn-interactive" 
            onClick={() => handleCopyAccount(mappedAccounts.membership.bank_name, mappedAccounts.membership.account_number)}
          >
            복사
          </button>
        </div>

        <div className="bank-card mutual-aid">
          <span className="bank-card-type">상조 통장</span>
          <span className="bank-card-name">{mappedAccounts.mutualAid.bank_name}</span>
          <span className="bank-card-number">{mappedAccounts.mutualAid.account_number}</span>
          <span className="bank-card-owner">예금주 {mappedAccounts.mutualAid.owner}</span>
          <button 
            className="bank-copy-btn btn-interactive" 
            onClick={() => handleCopyAccount(mappedAccounts.mutualAid.bank_name, mappedAccounts.mutualAid.account_number)}
          >
            복사
          </button>
        </div>
      </div>

      {/* 집행부 섹션 */}
      <div className="exec-section">
        <div className="exec-label">EXECUTIVE COMMITTEE</div>
        <div className="exec-title">2026 집행부</div>
        
        <div className="exec-grid">
          {/* 회장 카드 */}
          <div className="exec-card">
            <span className="exec-card-title">회장</span>
            <div className="exec-card-avatar">
              {getNickname(executives.president?.name || '미지정')}
            </div>
            <span className="exec-card-name">
              {executives.president?.name || '미지정'}
            </span>
          </div>

          {/* 총무 카드 */}
          <div className="exec-card">
            <span className="exec-card-title">총무</span>
            <div className="exec-card-avatar">
              {getNickname(executives.secretary?.name || '미지정')}
            </div>
            <span className="exec-card-name">
              {executives.secretary?.name || '미지정'}
            </span>
          </div>

          {/* 재무 카드 */}
          <div className="exec-card">
            <span className="exec-card-title">재무</span>
            <div className="exec-card-avatar">
              {getNickname(executives.treasurer?.name || '미지정')}
            </div>
            <span className="exec-card-name">
              {executives.treasurer?.name || '미지정'}
            </span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="search-container" style={{ marginTop: '24px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="search-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="이름, 직장, 연락처 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Chips */}
      <div className="filter-container">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-chip btn-interactive ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter} <span style={{ fontSize: '11px', opacity: 0.6, marginLeft: '2px', fontWeight: 'normal' }}>{getFilterCount(filter)}</span>
          </button>
        ))}
      </div>

      {/* Members List */}
      <div className="members-list">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="member-card btn-interactive"
              onClick={() => onSelectMember(member)}
            >
              <div className="member-info-wrapper">
                <div className="member-avatar">
                  {member.name.charAt(0)}
                </div>
                <div className="member-text">
                  <div className="member-name-row">
                    <span className="member-name">{member.name}</span>
                    {member.role && (
                      <span className="member-role-badge">{member.role}</span>
                    )}
                  </div>
                  <span className="member-company">
                    {member.company || '정보 없음'}
                  </span>
                </div>
              </div>

              {/* Call/SMS Quick Actions */}
              <div className="member-actions">
                <button
                  className="action-btn call btn-interactive"
                  onClick={(e) => handleActionClick(e, 'tel', member.phone)}
                  aria-label="전화 걸기"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="action-btn-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 01-4.706-4.706c-.154-.441.012-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </button>
                <button
                  className="action-btn sms btn-interactive"
                  onClick={(e) => handleActionClick(e, 'sms', member.phone)}
                  aria-label="문자 보내기"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="action-btn-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 4.75 4.75 0 003.433-.908 4.385 4.385 0 001.631.302c.046 0 .092-.002.138-.005z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '48px', height: '48px', color: 'var(--text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersTab;
