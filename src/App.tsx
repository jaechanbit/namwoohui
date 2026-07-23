import { Component, useState, useEffect } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import BottomNav from './components/BottomNav';
import MembersTab, { type Member, type BankAccount } from './components/MembersTab';
import MemberDetail from './components/MemberDetail';
import RulesDrawer from './components/RulesDrawer';
import ScheduleTab, { type MeetingSchedule } from './components/ScheduleTab';
import AdminTab from './components/AdminTab';
import AttendanceTab from './components/AttendanceTab';
import initialMembers from './data/members.json';
import { supabase } from './supabaseClient';
import { initialSessions, initialRecords, type AttendanceSession, type AttendanceRecord } from './data/attendanceData';

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

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px 20px', background: '#fff5f5', color: '#c53030', fontFamily: 'monospace', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '2px' }}>⚠️ 런타임 에러 감지</h2>
          <p style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.4 }}>{this.state.error?.toString()}</p>
          <pre style={{ fontSize: '11px', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #feb2b2', overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.5, flex: 1 }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }} 
            style={{ padding: '14px', background: '#c53030', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '14px' }}
          >
            앱 초기화 및 새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<string>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [schedules, setSchedules] = useState<MeetingSchedule[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isUsingDB, setIsUsingDB] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
            // 각 회원 객체에 photo가 없으면 로컬 스토리지에 백업된 로컬 사진이 있는지 연동
            const membersWithLocalPhotos = (data as Member[]).map(m => {
              if (!m.photo) {
                const localPhoto = localStorage.getItem(`namwoohui_photo_${m.id}`);
                if (localPhoto) {
                  return { ...m, photo: localPhoto };
                }
              }
              return m;
            });
            setMembers(membersWithLocalPhotos);
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

  // 3-1. 출석 정보 로드 (세션 & 레코드)
  useEffect(() => {
    if (isSupabaseConfigured()) {
      const fetchAttendance = async () => {
        try {
          // 1) 세션 로드
          const { data: dbSessions, error: sessionError } = await supabase
            .from('attendance_sessions')
            .select('*')
            .order('date', { ascending: true });
          
          // 2) 레코드 로드
          const { data: dbRecords, error: recordError } = await supabase
            .from('attendance_records')
            .select('*');

          if (!sessionError && !recordError && dbSessions && dbRecords) {
            // DB 형식을 클라이언트 Record 형식으로 포맷 변환
            const formattedRecordsMap: Record<number, Record<string, string>> = {};
            
            members.forEach(m => {
              formattedRecordsMap[m.id] = {};
            });

            dbRecords.forEach((r: any) => {
              const mId = Number(r.member_id);
              const sId = r.session_id;
              const statusVal = r.status || '';
              if (!formattedRecordsMap[mId]) {
                formattedRecordsMap[mId] = {};
              }
              formattedRecordsMap[mId][sId] = statusVal;
            });

            const formattedRecordsList: AttendanceRecord[] = Object.keys(formattedRecordsMap).map(key => ({
              memberId: Number(key),
              status: formattedRecordsMap[Number(key)]
            }));

            setAttendanceSessions(dbSessions as AttendanceSession[]);
            setAttendanceRecords(formattedRecordsList);
          } else {
            console.warn('Supabase fetch attendance failed or empty, fallback to local');
            loadLocalAttendance();
          }
        } catch (e) {
          console.error('Supabase connect error for attendance:', e);
          loadLocalAttendance();
        }
      };
      
      if (members.length > 0) {
        fetchAttendance();
      }
    } else {
      loadLocalAttendance();
    }

    function loadLocalAttendance() {
      const savedSessions = localStorage.getItem('namwoohui_attendance_sessions');
      const savedRecords = localStorage.getItem('namwoohui_attendance_records');
      
      if (savedSessions && savedRecords) {
        try {
          setAttendanceSessions(JSON.parse(savedSessions));
          setAttendanceRecords(JSON.parse(savedRecords));
        } catch (e) {
          setAttendanceSessions(initialSessions);
          setAttendanceRecords(initialRecords);
        }
      } else {
        setAttendanceSessions(initialSessions);
        setAttendanceRecords(initialRecords);
        localStorage.setItem('namwoohui_attendance_sessions', JSON.stringify(initialSessions));
        localStorage.setItem('namwoohui_attendance_records', JSON.stringify(initialRecords));
      }
    }
  }, [isUsingDB, members.length]);

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
            const isColumnError = error?.code === '42703' || error?.message?.includes('column') || error?.message?.includes('photo');
            
            if (isColumnError) {
              // photo 필드가 DB 테이블에 없을 경우, 제외하고 재인서트 시도
              const { photo, ...dataWithoutPhoto } = newMemberData;
              supabase
                .from('members')
                .insert([dataWithoutPhoto])
                .select()
                .then(({ data: retryData, error: retryError }) => {
                  if (!retryError && retryData && retryData.length > 0) {
                    const createdMember = retryData[0] as Member;
                    if (photo) {
                      localStorage.setItem(`namwoohui_photo_${createdMember.id}`, photo);
                      createdMember.photo = photo;
                    }
                    setMembers((prev) => [createdMember, ...prev]);
                    alert('실시간 DB에 photo 컬럼이 존재하지 않아, 회원 사진은 브라우저(로컬스토리지)에만 안전하게 백업되었습니다. (회원 정보는 DB에 정상 반영됨)');
                  } else {
                    console.error('Retry insert failed:', retryError);
                    alert('데이터 저장 실패: ' + (retryError?.message || '알 수 없는 오류'));
                  }
                });
            } else {
              alert('데이터 저장 실패: ' + (error?.message || '알 수 없는 오류'));
            }
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
          phone: updatedMember.phone,
          photo: updatedMember.photo
        })
        .eq('id', updatedMember.id)
        .then(({ error }) => {
          if (!error) {
            if (updatedMember.photo) {
              localStorage.setItem(`namwoohui_photo_${updatedMember.id}`, updatedMember.photo);
            } else {
              localStorage.removeItem(`namwoohui_photo_${updatedMember.id}`);
            }
            setMembers((prev) =>
              prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
            );
          } else {
            console.error('DB Update failed:', error);
            const isColumnError = error?.code === '42703' || error?.message?.includes('column') || error?.message?.includes('photo');
            
            if (isColumnError) {
              // photo 필드가 DB 테이블에 없을 경우, 제외하고 재수정 시도
              supabase
                .from('members')
                .update({
                  name: updatedMember.name,
                  role: updatedMember.role,
                  company: updatedMember.company,
                  phone: updatedMember.phone
                })
                .eq('id', updatedMember.id)
                .then(({ error: retryError }) => {
                  if (!retryError) {
                    if (updatedMember.photo) {
                      localStorage.setItem(`namwoohui_photo_${updatedMember.id}`, updatedMember.photo);
                    } else {
                      localStorage.removeItem(`namwoohui_photo_${updatedMember.id}`);
                    }
                    setMembers((prev) =>
                      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
                    );
                    alert('실시간 DB에 photo 컬럼이 존재하지 않아, 회원 사진은 브라우저(로컬스토리지)에만 안전하게 백업되었습니다. (회원 정보는 DB에 정상 반영됨)');
                  } else {
                    console.error('Retry update failed:', retryError);
                    alert('데이터 수정 실패: ' + retryError.message);
                  }
                });
            } else {
              alert('데이터 수정 실패: ' + error.message);
            }
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
            localStorage.removeItem(`namwoohui_photo_${id}`);
            setMembers((prev) => prev.filter((m) => m.id !== id));
          } else {
            console.error('DB Delete failed:', error);
            alert('데이터 삭제 실패: ' + error.message);
          }
        });
    } else {
      localStorage.removeItem(`namwoohui_photo_${id}`);
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

  // 8. 출석부 관련 CRUD 핸들러
  const handleAddAttendanceSession = (title: string, date: string, isMutualAid: boolean) => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: AttendanceSession = {
      id: newSessionId,
      title,
      date,
      is_mutual_aid: isMutualAid
    };

    const updatedSessions = [...attendanceSessions, newSession].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const updatedRecords = attendanceRecords.map(rec => ({
      ...rec,
      status: {
        ...rec.status,
        [newSessionId]: 'present'
      }
    }));

    if (isUsingDB) {
      supabase
        .from('attendance_sessions')
        .insert([newSession])
        .then(({ error: sessErr }) => {
          if (sessErr) {
            console.error('DB session insert failed:', sessErr);
            alert('출석 항목 DB 저장 실패: ' + sessErr.message);
            return;
          }

          const recordInserts = members.map(m => ({
            member_id: m.id,
            session_id: newSessionId,
            status: 'present'
          }));

          supabase
            .from('attendance_records')
            .insert(recordInserts)
            .then(({ error: recErr }) => {
              if (!recErr) {
                setAttendanceSessions(updatedSessions);
                setAttendanceRecords(updatedRecords);
              } else {
                console.error('DB attendance records insert failed:', recErr);
                alert('출석 레코드 초기화 DB 저장 실패: ' + recErr.message);
              }
            });
        });
    } else {
      setAttendanceSessions(updatedSessions);
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('namwoohui_attendance_sessions', JSON.stringify(updatedSessions));
      localStorage.setItem('namwoohui_attendance_records', JSON.stringify(updatedRecords));
    }
  };

  const handleUpdateAttendanceRecord = (memberId: number, sessionId: string, status: string) => {
    const updatedRecords = attendanceRecords.map(rec => {
      if (rec.memberId === memberId) {
        return {
          ...rec,
          status: {
            ...rec.status,
            [sessionId]: status
          }
        };
      }
      return rec;
    });

    const hasRecord = attendanceRecords.some(rec => rec.memberId === memberId);
    if (!hasRecord) {
      updatedRecords.push({
        memberId,
        status: { [sessionId]: status }
      });
    }

    if (isUsingDB) {
      supabase
        .from('attendance_records')
        .upsert(
          { member_id: memberId, session_id: sessionId, status: status },
          { onConflict: 'member_id,session_id' }
        )
        .then(({ error }) => {
          if (!error) {
            setAttendanceRecords(updatedRecords);
          } else {
            console.error('DB attendance upsert failed:', error);
            alert('출석 기록 DB 저장 실패: ' + error.message);
          }
        });
    } else {
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('namwoohui_attendance_records', JSON.stringify(updatedRecords));
    }
  };

  const handleDeleteAttendanceSession = (sessionId: string) => {
    const session = attendanceSessions.find(s => s.id === sessionId);
    if (!session) return;

    if (!window.confirm(`'${session.title}' 항목을 삭제하시겠습니까? 관련 출석 기록도 함께 삭제됩니다.`)) {
      return;
    }

    const updatedSessions = attendanceSessions.filter(s => s.id !== sessionId);
    const updatedRecords = attendanceRecords.map(rec => {
      const nextStatus = { ...rec.status };
      delete nextStatus[sessionId];
      return { ...rec, status: nextStatus };
    });

    if (isUsingDB) {
      supabase
        .from('attendance_sessions')
        .delete()
        .eq('id', sessionId)
        .then(({ error }) => {
          if (!error) {
            setAttendanceSessions(updatedSessions);
            setAttendanceRecords(updatedRecords);
          } else {
            console.error('DB session delete failed:', error);
            alert('출석 항목 DB 삭제 실패: ' + error.message);
          }
        });
    } else {
      setAttendanceSessions(updatedSessions);
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('namwoohui_attendance_sessions', JSON.stringify(updatedSessions));
      localStorage.setItem('namwoohui_attendance_records', JSON.stringify(updatedRecords));
    }
  };

  const handleUpdateAttendanceSession = (sessionId: string, newTitle: string, newDate: string, isMutualAid: boolean) => {
    const updatedSessions = attendanceSessions.map(s => {
      if (s.id === sessionId) {
        return { ...s, title: newTitle, date: newDate, is_mutual_aid: isMutualAid };
      }
      return s;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (isUsingDB) {
      supabase
        .from('attendance_sessions')
        .update({ title: newTitle, date: newDate, is_mutual_aid: isMutualAid })
        .eq('id', sessionId)
        .then(({ error }) => {
          if (!error) {
            setAttendanceSessions(updatedSessions);
          } else {
            console.error('DB session update failed:', error);
            alert('출석 항목 DB 수정 실패: ' + error.message);
          }
        });
    } else {
      setAttendanceSessions(updatedSessions);
      localStorage.setItem('namwoohui_attendance_sessions', JSON.stringify(updatedSessions));
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
            onOpenRules={() => setIsRulesOpen(true)}
          />
        );
      case 'schedule':
        return <ScheduleTab schedules={schedules} />;
      case 'attendance':
        return (
          <AttendanceTab
            members={members}
            sessions={attendanceSessions}
            records={attendanceRecords}
            onAddSession={handleAddAttendanceSession}
            onUpdateRecord={handleUpdateAttendanceRecord}
            onDeleteSession={handleDeleteAttendanceSession}
            onUpdateSession={handleUpdateAttendanceSession}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        );
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
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        );
      default:
        return (
          <MembersTab
            members={members}
            accounts={accounts}
            onSelectMember={(member) => setSelectedMember(member)}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
      {/* Header */}
      <header className="app-header glass">
        <h1 
          className="app-title btn-interactive" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={() => {
            setActiveTab('members');
            setSelectedMember(null);
          }}
        >
          <img src="/namwoohui/logo.png" alt="남우회 로고" style={{ height: '32px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
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
        onUpdateMember={handleUpdateMember}
      />

      {/* Rules Popup Drawer */}
      <RulesDrawer
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
