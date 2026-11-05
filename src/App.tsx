import React, { useState } from 'react';
import { AppShell } from './layouts/AppShell';
import { TeacherStudioView } from './views/teacher/TeacherStudioView';
import { StudentArenaView } from './views/student/StudentArenaView';
import { SchoolManagerView } from './views/manager/SchoolManagerView';
import { SuperAdminView } from './views/admin/SuperAdminView';
import { UserRole } from './core/security/security-gatekeeper';
import { initDevLicenseSeed } from './core/licensing/dev-license-seed';

initDevLicenseSeed();

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('TEACHER');
  const [activeNavId, setActiveNavId] = useState('teacher-studio');

  if (currentRole === 'STUDENT') {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#090d16]">
        <button onClick={() => setCurrentRole('TEACHER')} className="absolute top-4 left-4 z-50 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-slate-700">خروج از محیط دانش‌آموز</button>
        <StudentArenaView />
      </div>
    );
  }

  return (
    <AppShell
      currentRole={currentRole}
      onRoleChange={(role) => {
        setCurrentRole(role);
        if (role === 'TEACHER') setActiveNavId('teacher-studio');
        else if (role === 'SCHOOL_MANAGER') setActiveNavId('manager-overview');
        else if (role === 'SUPER_ADMIN') setActiveNavId('admin-metrics');
      }}
      activeNavId={activeNavId}
      onNavSelect={setActiveNavId}
    >
      {currentRole === 'TEACHER' && <TeacherStudioView />}
      {currentRole === 'SCHOOL_MANAGER' && <SchoolManagerView />}
      {currentRole === 'SUPER_ADMIN' && <SuperAdminView />}
    </AppShell>
  );
}
