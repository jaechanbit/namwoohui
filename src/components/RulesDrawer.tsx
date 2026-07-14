import React, { useState, useMemo } from 'react';
import { rulesData } from '../data/rulesData';
import type { RuleChapter } from '../data/rulesData';

interface RulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesDrawer = ({ isOpen, onClose }: RulesDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1]); // 기본적으로 1장 열어둠

  // 장 접기/펴기 토글
  const toggleChapter = (id: number) => {
    if (expandedChapters.includes(id)) {
      setExpandedChapters(expandedChapters.filter((cId) => cId !== id));
    } else {
      setExpandedChapters([...expandedChapters, id]);
    }
  };

  // 회칙 검색 필터링
  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return rulesData;

    return rulesData
      .map((chapter) => {
        // 검색어와 일치하는 조항들만 필터링
        const matchedArticles = chapter.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
          ...chapter,
          articles: matchedArticles,
        };
      })
      // 조항 매칭이 한 개라도 있는 장만 남김
      .filter((chapter) => chapter.articles.length > 0);
  }, [searchQuery]);

  // 검색어가 있을 때는 매칭된 장들을 자동으로 펼쳐서 검색 결과를 즉시 보여줌
  const activeExpandedChapters = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return filteredRules.map((c) => c.id);
    }
    return expandedChapters;
  }, [searchQuery, filteredRules, expandedChapters]);

  // 모든 훅이 정의된 후 조기 반환 실행 (React Hooks 룰 준수)
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop animate-fade-in" onClick={onClose} />

      {/* Rules Bottom Sheet Drawer */}
      <div className="drawer-content" style={{ maxHeight: '85vh', height: '85vh' }}>
        <div className="drawer-handle" />

        {/* Header */}
        <div className="drawer-header" style={{ marginBottom: '8px' }}>
          <div>
            <h2 className="modal-title" style={{ fontSize: '18px', fontWeight: 900, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px' }}>📑</span> 남우회 회칙 안내
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>조항을 터치하면 상세 내용이 펼쳐집니다.</p>
          </div>
          <button className="drawer-close btn-interactive" onClick={onClose} aria-label="닫기">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar in Drawer */}
        <div className="search-container" style={{ marginBottom: '14px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="search-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="규정 키워드 검색 (예: 상조, 회비, 선출)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: searchQuery ? '40px' : '16px' }}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn btn-interactive"
              onClick={() => setSearchQuery('')}
              aria-label="검색어 지우기"
              style={{ right: '12px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '14px', height: '14px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Rules Body (Scrollable) */}
        <div className="drawer-body" style={{ overflowY: 'auto', flex: 1, paddingBottom: '20px', gap: '10px' }}>
          {filteredRules.length === 0 ? (
            <div className="pending-location-msg" style={{ margin: '20px 0', padding: '24px' }}>
              검색어와 매칭되는 회칙 조항이 없습니다.
            </div>
          ) : (
            filteredRules.map((chapter) => {
              const isExpanded = activeExpandedChapters.includes(chapter.id);
              return (
                <div
                  key={chapter.id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: '#ffffff',
                    boxShadow: 'var(--shadow-sm)',
                    flexShrink: 0
                  }}
                >
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: isExpanded ? 'var(--primary-light)' : 'transparent',
                      border: 'none',
                      color: isExpanded ? 'var(--primary)' : 'var(--text-main)',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{chapter.chapter}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      style={{
                        width: '16px',
                        height: '16px',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        color: isExpanded ? 'var(--primary)' : 'var(--text-muted)'
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Chapter Articles list */}
                  {isExpanded && (
                    <div style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
                      {chapter.articles.map((article, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            paddingTop: idx > 0 ? '14px' : '6px',
                            borderTop: idx > 0 ? '1px dashed var(--border-color)' : 'none'
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>
                            {article.title}
                          </span>
                          <span
                            style={{
                              fontSize: '12.5px',
                              color: 'var(--text-main)',
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                              fontWeight: 500
                            }}
                          >
                            {article.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default RulesDrawer;
