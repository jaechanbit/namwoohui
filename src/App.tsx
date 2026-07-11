import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import MembersTab, { type Member } from './components/MembersTab';
import MemberDetail from './components/MemberDetail';
import ScheduleTab from './components/ScheduleTab';
import AdminTab from './components/AdminTab';
import initialMembers from './data/members.json';

function App() {
  const [activeTab, setActiveTab] = useState<string>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // API 및 로컬스토리지 연동하여 회원 목록 로드
  useEffect(() => {
    fetch('/api/members')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('API response not ok');
      })
      .then((data) => {
        setMembers(data);
        localStorage.setItem('namwoohui_members', JSON.stringify(data));
      })
      .catch((e) => {
        console.warn('Could not fetch from server API, falling back to localStorage', e);
        const savedMembers = localStorage.getItem('namwoohui_members');
        if (savedMembers) {
          try {
            setMembers(JSON.parse(savedMembers));
          } catch (err) {
            setMembers(initialMembers);
            localStorage.setItem('namwoohui_members', JSON.stringify(initialMembers));
          }
        } else {
          setMembers(initialMembers);
          localStorage.setItem('namwoohui_members', JSON.stringify(initialMembers));
        }
      });
  }, []);

  // 서버 API 및 로컬스토리지에 회원 정보 영구 저장
  const saveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem('namwoohui_members', JSON.stringify(newMembers));

    fetch('/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMembers)
    }).catch((e) => {
      console.error('Failed to sync members with server API', e);
    });
  };

  // CRUD 연동 함수들
  const handleAddMember = (newMemberData: Omit<Member, 'id'>) => {
    const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
    const newMember: Member = {
      id: newId,
      ...newMemberData
    };
    const updated = [newMember, ...members];
    saveMembers(updated);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    const updated = members.map((m) => (m.id === updatedMember.id ? updatedMember : m));
    saveMembers(updated);
  };

  const handleDeleteMember = (id: number) => {
    const updated = members.filter((m) => m.id !== id);
    saveMembers(updated);
  };

  // 현재 활성화된 탭 컨텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return (
          <MembersTab
            members={members}
            onSelectMember={(member) => setSelectedMember(member)}
          />
        );
      case 'schedule':
        return <ScheduleTab />;
      case 'admin':
        return (
          <AdminTab
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        );
      default:
        return (
          <MembersTab
            members={members}
            onSelectMember={(member) => setSelectedMember(member)}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header glass">
        <h1 className="app-title">
          남우회 <span>NAMWOOHUI</span>
        </h1>
      </header>

      {/* Main Tab Contents */}
      <main className="app-content">
        {renderTabContent()}
      </main>

      {/* Detail Popup Drawer */}
      <MemberDetail
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      {/* Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
