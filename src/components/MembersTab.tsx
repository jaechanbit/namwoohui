import React, { useState, useMemo } from 'react';

export interface Member {
  id: number;
  name: string;
  role: string;
  company: string;
  phone: string;
}

interface MembersTabProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
}

const MembersTab: React.FC<MembersTabProps> = ({ members, onSelectMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');

  const filters = ['전체', '회장단', '운영진', '상조위원', '감사'];

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
        return member.role.includes('회장');
      }
      if (activeFilter === '운영진') {
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
      {/* Search Input */}
      <div className="search-container">
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
            {filter}
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
