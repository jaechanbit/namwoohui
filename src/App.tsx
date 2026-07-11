import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import MembersTab, { type Member } from './components/MembersTab';
import MemberDetail from './components/MemberDetail';
import ScheduleTab from './components/ScheduleTab';
import AdminTab from './components/AdminTab';
import initialMembers from './data/members.json';
import { supabase } from './supabaseClient';

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && url !== 'YOUR_SUPABASE_URL' && key && key !== 'YOUR_SUPABASE_ANON_KEY';
};

function App() {
  const [activeTab, setActiveTab] = useState<string>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isUsingDB, setIsUsingDB] = useState<boolean>(false);

  // 회원 목록 로드 (Supabase 우선, 연결 안될 시 JSON 폴백)
  useEffect(() => {
    if (isSupabaseConfigured()) {
      setIsUsingDB(true);
      const fetchMembers = async () => {
        try {
          const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('name', { ascending: true });
          
          if (!error && data) {
            setMembers(data as Member[]);
          } else {
            console.error('Supabase fetch failed, falling back to local data:', error);
            setMembers(initialMembers);
          }
        } catch (e: unknown) {
          console.error('Supabase connect error, falling back to local data:', e);
          setMembers(initialMembers);
        }
      };
      fetchMembers();
    } else {
      setIsUsingDB(false);
      // 로컬스토리지 연동하여 데모 로드
      const savedMembers = localStorage.getItem('namwoohui_members');
      if (savedMembers) {
        try {
          setMembers(JSON.parse(savedMembers));
        } catch (e) {
          setMembers(initialMembers);
        }
      } else {
        setMembers(initialMembers);
      }
    }
  }, []);

  // CRUD 연동 함수들
  const handleAddMember = (newMemberData: Omit<Member, 'id'>) => {
    if (isUsingDB) {
      supabase
        .from('members')
        .insert([newMemberData])
        .select()
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setMembers((prev) => [data[0] as Member, ...prev]);
          } else {
            console.error('DB Insert failed:', error);
            alert('데이터 저장 실패: ' + (error?.message || '알 수 없는 오류'));
          }
        });
    } else {
      const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
      const newMember: Member = { id: newId, ...newMemberData };
      const updated = [newMember, ...members];
      setMembers(updated);
      localStorage.setItem('namwoohui_members', JSON.stringify(updated));
    }
  };

  const handleUpdateMember = (updatedMember: Member) => {
    if (isUsingDB) {
      supabase
        .from('members')
        .update({
          name: updatedMember.name,
          role: updatedMember.role,
          company: updatedMember.company,
          phone: updatedMember.phone
        })
        .eq('id', updatedMember.id)
        .then(({ error }) => {
          if (!error) {
            setMembers((prev) =>
              prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
            );
          } else {
            console.error('DB Update failed:', error);
            alert('데이터 수정 실패: ' + error.message);
          }
        });
    } else {
      const updated = members.map((m) => (m.id === updatedMember.id ? updatedMember : m));
      setMembers(updated);
      localStorage.setItem('namwoohui_members', JSON.stringify(updated));
    }
  };

  const handleDeleteMember = (id: number) => {
    if (isUsingDB) {
      supabase
        .from('members')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (!error) {
            setMembers((prev) => prev.filter((m) => m.id !== id));
          } else {
            console.error('DB Delete failed:', error);
            alert('데이터 삭제 실패: ' + error.message);
          }
        });
    } else {
      const updated = members.filter((m) => m.id !== id);
      setMembers(updated);
      localStorage.setItem('namwoohui_members', JSON.stringify(updated));
    }
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
        {isUsingDB && <span className="db-sync-badge">실시간 DB 동기화</span>}
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
