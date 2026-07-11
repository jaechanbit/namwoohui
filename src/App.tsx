import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import MembersTab, { type Member, type BankAccount } from './components/MembersTab';
import MemberDetail from './components/MemberDetail';
import ScheduleTab, { type MeetingSchedule } from './components/ScheduleTab';
import AdminTab from './components/AdminTab';
import initialMembers from './data/members.json';
import { supabase } from './supabaseClient';

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && url !== 'YOUR_SUPABASE_URL' && key && key !== 'YOUR_SUPABASE_ANON_KEY';
};

// 기본 데모용 계좌번호 데이터
const initialAccounts: BankAccount[] = [
  { id: 1, type: 'membership', bank_name: '국민은행', account_number: '000000-00-000000', owner: '남우회' },
  { id: 2, type: 'mutual_aid', bank_name: '농협은행', account_number: '000-0000-0000-00', owner: '남우회' }
];

function App() {
  const [activeTab, setActiveTab] = useState<string>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [schedules, setSchedules] = useState<MeetingSchedule[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isUsingDB, setIsUsingDB] = useState<boolean>(false);

  // 1. 회원 목록 로드
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
            console.error('Supabase fetch members failed:', error);
            setMembers(initialMembers);
          }
        } catch (e: unknown) {
          console.error('Supabase connect error for members:', e);
          setMembers(initialMembers);
        }
      };
      fetchMembers();
    } else {
      setIsUsingDB(false);
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

  // 2. 모임 일정 목록 로드
  useEffect(() => {
    if (isSupabaseConfigured()) {
      const fetchSchedules = async () => {
        try {
          const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .order('date', { ascending: true });
          
          if (!error && data) {
            setSchedules(data as MeetingSchedule[]);
          } else {
            console.error('Supabase fetch schedules failed:', error);
          }
        } catch (e: unknown) {
          console.error('Supabase connect error for schedules:', e);
        }
      };
      fetchSchedules();
    } else {
      const savedSchedules = localStorage.getItem('namwoohui_schedules');
      if (savedSchedules) {
        try {
          setSchedules(JSON.parse(savedSchedules));
        } catch (e) {
          setSchedules([]);
        }
      } else {
        setSchedules([]);
      }
    }
  }, []);

  // 3. 통장 정보 로드
  useEffect(() => {
    if (isSupabaseConfigured()) {
      const fetchAccounts = async () => {
        try {
          const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .order('id', { ascending: true });
          
          if (!error && data && data.length > 0) {
            setAccounts(data as BankAccount[]);
          } else {
            console.warn('Supabase fetch accounts empty or failed, using defaults');
            setAccounts(initialAccounts);
          }
        } catch (e: unknown) {
          console.error('Supabase connect error for accounts:', e);
          setAccounts(initialAccounts);
        }
      };
      fetchAccounts();
    } else {
      const savedAccounts = localStorage.getItem('namwoohui_accounts');
      if (savedAccounts) {
        try {
          setAccounts(JSON.parse(savedAccounts));
        } catch (e) {
          setAccounts(initialAccounts);
        }
      } else {
        setAccounts(initialAccounts);
      }
    }
  }, []);

  // 4. 친구 CRUD 핸들러
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

  // 5. 모임 일정 CRUD 핸들러
  const handleAddSchedule = (newScheduleData: Omit<MeetingSchedule, 'id'>) => {
    if (isUsingDB) {
      supabase
        .from('schedules')
        .insert([newScheduleData])
        .select()
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setSchedules((prev) => [...prev, data[0] as MeetingSchedule].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
          } else {
            console.error('DB Insert schedule failed:', error);
            alert('일정 저장 실패: ' + (error?.message || '알 수 없는 오류'));
          }
        });
    } else {
      const newId = schedules.length > 0 ? Math.max(...schedules.map((s) => s.id)) + 1 : 1;
      const newSchedule: MeetingSchedule = { id: newId, ...newScheduleData };
      const updated = [...schedules, newSchedule].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSchedules(updated);
      localStorage.setItem('namwoohui_schedules', JSON.stringify(updated));
    }
  };

  const handleUpdateSchedule = (updatedSchedule: MeetingSchedule) => {
    if (isUsingDB) {
      supabase
        .from('schedules')
        .update({
          title: updatedSchedule.title,
          date: updatedSchedule.date,
          location: updatedSchedule.location
        })
        .eq('id', updatedSchedule.id)
        .then(({ error }) => {
          if (!error) {
            setSchedules((prev) =>
              prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            );
          } else {
            console.error('DB Update schedule failed:', error);
            alert('일정 수정 실패: ' + error.message);
          }
        });
    } else {
      const updated = schedules.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSchedules(updated);
      localStorage.setItem('namwoohui_schedules', JSON.stringify(updated));
    }
  };

  const handleDeleteSchedule = (id: number) => {
    if (isUsingDB) {
      supabase
        .from('schedules')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (!error) {
            setSchedules((prev) => prev.filter((s) => s.id !== id));
          } else {
            console.error('DB Delete schedule failed:', error);
            alert('일정 삭제 실패: ' + error.message);
          }
        });
    } else {
      const updated = schedules.filter((s) => s.id !== id);
      setSchedules(updated);
      localStorage.setItem('namwoohui_schedules', JSON.stringify(updated));
    }
  };

  // 6. 통장 정보 수정 핸들러
  const handleUpdateAccounts = (updatedAccounts: BankAccount[]) => {
    if (isUsingDB) {
      // 순차적으로 수파베이스에 update를 실행
      const updatePromises = updatedAccounts.map(account => 
        supabase
          .from('accounts')
          .update({
            bank_name: account.bank_name,
            account_number: account.account_number,
            owner: account.owner
          })
          .eq('id', account.id)
      );

      Promise.all(updatePromises).then((results) => {
        const hasError = results.some(r => r.error);
        if (!hasError) {
          setAccounts(updatedAccounts);
          alert('통장 정보가 실시간 DB에 안전하게 저장되었습니다.');
        } else {
          console.error('Some account updates failed');
          alert('일부 통장 정보 저장 실패');
        }
      });
    } else {
      setAccounts(updatedAccounts);
      localStorage.setItem('namwoohui_accounts', JSON.stringify(updatedAccounts));
      alert('데모용 통장 정보가 로컬스토리지에 저장되었습니다.');
    }
  };

  // 7. 집행부 임원 변경 핸들러
  const handleAssignExecutive = async (role: '회장' | '총무' | '재무', targetMemberId: number) => {
    if (isUsingDB) {
      try {
        // 1) 기존에 해당 직책을 맡았던 사람들의 직책을 빈 값('')으로 초기화
        await supabase.from('members').update({ role: '' }).eq('role', role);
        // 2) 새로 임명된 회원에게 직책을 부여
        await supabase.from('members').update({ role: role }).eq('id', targetMemberId);
        
        // 3) 전체 리로드하여 갱신
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('name', { ascending: true });
        
        if (!error && data) {
          setMembers(data as Member[]);
          alert(`새로운 ${role} 임명이 성공적으로 완료되었습니다.`);
        }
      } catch (err) {
        console.error('Assign executive failed:', err);
        alert('임원 변경 처리 중 실패');
      }
    } else {
      // 로컬스토리지 기반 데모 모드 작동
      const updated = members.map(m => {
        if (m.role === role) return { ...m, role: '' };
        if (m.id === targetMemberId) return { ...m, role: role };
        return m;
      });
      setMembers(updated);
      localStorage.setItem('namwoohui_members', JSON.stringify(updated));
      alert(`데모용 ${role} 임명이 로컬에 기록되었습니다.`);
    }
  };

  // 현재 활성화된 탭 컨텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return (
          <MembersTab
            members={members}
            accounts={accounts}
            onSelectMember={(member) => setSelectedMember(member)}
          />
        );
      case 'schedule':
        return <ScheduleTab schedules={schedules} />;
      case 'admin':
        return (
          <AdminTab
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            accounts={accounts}
            onUpdateAccounts={handleUpdateAccounts}
            onAssignExecutive={handleAssignExecutive}
          />
        );
      default:
        return (
          <MembersTab
            members={members}
            accounts={accounts}
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
