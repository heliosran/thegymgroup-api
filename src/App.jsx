import { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { callEndpoint } from './apiClient';
import { endpointGroups } from './data/endpoints';
import { GymAppContext, useGymApp } from './app/context';
import EndpointRunner from './components/EndpointRunner';

const tabs = [
  ['/', 'Dashboard'],
  ['/classes', 'Classes'],
  ['/schedule', 'Schedule'],
  ['/progress', 'Progress'],
  ['/profile', 'Profile'],
  ['/membership', 'Membership'],
  ['/challenges', 'Challenges'],
  ['/explorer', 'API Tools']
];

const defaultConfig = { baseUrl: '', companyUuid: '', clubUuid: '' };

function classBrief(item) { return item?.brief || item || {}; }
function getGroup(title) { return endpointGroups.find((group) => group.title === title)?.endpoints || []; }

function Screen({ title, endpointTitles = [], children }) {
  const { run } = useGymApp();
  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-xl font-semibold text-cyan-300">{title}</h2>
      {children}
      {endpointTitles.map((groupTitle) => (
        <div key={groupTitle} className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-300">Mapped endpoints: {groupTitle}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {getGroup(groupTitle).map((endpoint) => (
              <EndpointRunner key={endpoint.key} endpoint={endpoint} onRun={(k, values) => run(k, values)} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function LoginPage() {
  const { loginForm, setLoginForm, config, setConfig, login, status } = useGymApp();
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto mt-20 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
        <h1 className="text-2xl font-bold">Gym App Clone</h1>
        <p className="mt-1 text-sm text-slate-300">Sign in to start your full gym journey. Leave Base URL empty for local proxy (/np, /analysis) to avoid CORS in development.</p>
        <div className="mt-4 space-y-3">
          <input placeholder="Base URL" value={config.baseUrl} onChange={(event) => setConfig((c) => ({ ...c, baseUrl: event.target.value }))} />
          <input placeholder="Company UUID" value={config.companyUuid} onChange={(event) => setConfig((c) => ({ ...c, companyUuid: event.target.value }))} />
          <input placeholder="Email" value={loginForm.username} onChange={(event) => setLoginForm((f) => ({ ...f, username: event.target.value }))} />
          <input placeholder="PIN / password" type="password" value={loginForm.password} onChange={(event) => setLoginForm((f) => ({ ...f, password: event.target.value }))} />
          <button className="w-full bg-cyan-600 text-white" onClick={login} disabled={status.loading}>Sign in</button>
          {status.error && <p className="text-xs text-rose-400">{status.error}</p>}
        </div>
      </div>
    </main>
  );
}

function AppLayout() {
  const { auth, status, log } = useGymApp();
  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-6">
      <header className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-sm text-slate-300">Welcome back,</p>
        <h1 className="text-2xl font-bold">{auth.firstName || 'Member'}</h1>
        <p className="mt-1 text-xs text-slate-400">{auth.exerciserUuid}</p>
        {status.error && <p className="mt-2 text-xs text-rose-400">{status.error}</p>}
      </header>
      <nav className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-8">
        {tabs.map(([path, label]) => (
          <NavLink key={path} to={path} className={({ isActive }) => `${isActive ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'} rounded-lg px-3 py-2 text-sm font-medium`}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-300">Recent API activity</h2>
        <pre className="mt-2 max-h-72 overflow-auto rounded bg-slate-950 p-3 text-xs">{JSON.stringify(log[0], null, 2)}</pre>
      </section>
    </main>
  );
}

function DashboardPage() {
  const { gymBusyness, schedule, checkIns, loadHome, loadSchedule, run, config, setGymBusyness } = useGymApp();
  return (
    <Screen title="Dashboard" endpointTitles={['Gym & Check-ins']}>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-700 p-3"><h3>Gym busyness</h3><p className="text-2xl">{gymBusyness?.currentPercentage ?? '—'}%</p><button className="bg-slate-700 text-white" onClick={() => run('gymBusyness', { gymLocationId: config.clubUuid }, { onSuccess: setGymBusyness })}>Refresh</button></article>
        <article className="rounded-xl border border-slate-700 p-3"><h3>Next class</h3><p>{classBrief(schedule[0]).name || 'No upcoming class'}</p><button className="bg-slate-700 text-white" onClick={loadSchedule}>Reload</button></article>
        <article className="rounded-xl border border-slate-700 p-3"><h3>Recent visits</h3><p className="text-2xl">{checkIns.length}</p><button className="bg-slate-700 text-white" onClick={loadHome}>Refresh</button></article>
      </div>
    </Screen>
  );
}

function ClassesPage() {
  const { classWindow, setClassWindow, classes, loadClasses, bookingAction } = useGymApp();
  return (
    <Screen title="Classes" endpointTitles={['Classes & Booking']}>
      <div className="grid gap-2 md:grid-cols-4">
        <input placeholder="startDateTime" value={classWindow.startDateTime} onChange={(e) => setClassWindow((w) => ({ ...w, startDateTime: e.target.value }))} />
        <input placeholder="endDateTime" value={classWindow.endDateTime} onChange={(e) => setClassWindow((w) => ({ ...w, endDateTime: e.target.value }))} />
        <input placeholder="type" value={classWindow.type} onChange={(e) => setClassWindow((w) => ({ ...w, type: e.target.value }))} />
        <button className="bg-cyan-600 text-white" onClick={loadClasses}>Find classes</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {classes.map((item) => { const brief = classBrief(item); return <article key={brief.id} className="rounded-xl border border-slate-700 p-3"><p className="font-semibold">{brief.name}</p><div className="mt-2 flex gap-2"><button className="bg-emerald-600 text-white" onClick={() => bookingAction('addExerciser', brief.id)}>Book</button><button className="bg-rose-600 text-white" onClick={() => bookingAction('removeExerciser', brief.id)}>Cancel</button><button className="bg-amber-600 text-white" onClick={() => bookingAction('waitlistAdd', brief.id)}>Waitlist</button></div></article>; })}
      </div>
    </Screen>
  );
}

const SchedulePage = () => {
  const { schedule, loadSchedule } = useGymApp();
  return <Screen title="My Schedule" endpointTitles={['Classes & Booking']}><button className="bg-cyan-600 text-white" onClick={loadSchedule}>Refresh schedule</button><div>{schedule.map((item) => <p key={classBrief(item).id}>{classBrief(item).name}</p>)}</div></Screen>;
};

const ProgressPage = () => {
  const { checkIns, loadHome } = useGymApp();
  return <Screen title="Progress" endpointTitles={['Gym & Check-ins', 'Account, Schedule, Notifications']}><button className="bg-cyan-600 text-white" onClick={loadHome}>Refresh check-ins</button><p>Visits: {checkIns.length}</p></Screen>;
};

const ProfilePage = () => {
  const { profile, setProfile, run } = useGymApp();
  return <Screen title="Profile" endpointTitles={['Profile & Membership']}><div className="space-y-2"><button className="bg-slate-700 text-white" onClick={() => run('profileGet', {}, { onSuccess: setProfile })}>Load profile</button><input placeholder="firstName" value={profile.firstName || ''} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} /><button className="bg-cyan-600 text-white" onClick={() => run('profilePut', profile)}>Save profile</button></div></Screen>;
};

const MembershipPage = () => {
  const { run } = useGymApp();
  return <Screen title="Membership" endpointTitles={['Profile & Membership', 'Feedback, Referrals, eGym & Extras']}><div className="flex gap-2"><button className="bg-slate-700 text-white" onClick={() => run('membershipGet')}>Membership</button><button className="bg-slate-700 text-white" onClick={() => run('membershipBarcode')}>Barcode</button></div></Screen>;
};

const ChallengesPage = () => {
  const { challenges, loadChallenges } = useGymApp();
  return <Screen title="Challenges" endpointTitles={['Challenges & Activity Levels']}><button className="bg-cyan-600 text-white" onClick={loadChallenges}>Load challenges</button><p>Active: {challenges.active?.length || 0}</p><p>Past: {challenges.past?.length || 0}</p></Screen>;
};

const ExplorerPage = () => <Screen title="API Explorer" endpointTitles={endpointGroups.map((group) => group.title)} />;

function ProtectedRoutes() {
  const { isAuthed } = useGymApp();
  return isAuthed ? <AppLayout /> : <Navigate to="/login" replace />;
}

export default function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [auth, setAuth] = useState({ cookie: '', exerciserUuid: '', firstName: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [classes, setClasses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [gymBusyness, setGymBusyness] = useState(null);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [challenges, setChallenges] = useState({ active: [], past: [] });
  const [log, setLog] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: '' });
  const [classWindow, setClassWindow] = useState({ startDateTime: `${Date.now()}`, endDateTime: `${Date.now() + 7 * 86400000}`, type: '' });

  const isAuthed = Boolean(auth.exerciserUuid && auth.cookie);

  const run = async (endpointKey, values = {}, options = {}) => {
    try {
      setStatus({ loading: true, error: '' });
      const result = await callEndpoint({ baseUrl: config.baseUrl, endpointKey, values: { ...config, exerciserUuid: auth.exerciserUuid, ...values } });
      setLog((current) => [{ endpointKey, at: new Date().toISOString(), result }, ...current].slice(0, 30));
      if (!result.ok) throw new Error(`${endpointKey} failed (${result.status})`);
      options.onSuccess?.(result.data);
      return result.data;
    } catch (error) {
      setStatus({ loading: false, error: error.message });
      return null;
    } finally {
      setStatus((current) => ({ ...current, loading: false }));
    }
  };

  const loadSchedule = () => run('schedule', { startDateTime: `${Date.now() - 86400000}`, endDateTime: `${Date.now() + 14 * 86400000}`, clubUuid: config.clubUuid }, { onSuccess: setSchedule });
  const loadHome = async () => Promise.all([
    run('gymBusyness', { gymLocationId: config.clubUuid }, { onSuccess: setGymBusyness }),
    loadSchedule(),
    run('checkinHistory', { startDate: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 19), endDate: new Date().toISOString().slice(0, 19) }, { onSuccess: (data) => setCheckIns(data.checkIns || data) })
  ]);
  const loadClasses = () => run('classes', classWindow, { onSuccess: setClasses });
  const loadChallenges = async () => Promise.all([
    run('challengesActive', {}, { onSuccess: (data) => setChallenges((c) => ({ ...c, active: data })) }),
    run('challengesPast', {}, { onSuccess: (data) => setChallenges((c) => ({ ...c, past: data })) })
  ]);
  const bookingAction = async (action, classUuid) => { await run(action, { classUuid, companyUuid: config.companyUuid, exerciserUuid: auth.exerciserUuid }); await Promise.all([loadClasses(), loadSchedule()]); };

  const login = async () => {
    const payload = await run('login', loginForm);
    if (!payload?.uuid) return;
    setAuth({ cookie: `JSESSIONID=${payload.sessionId || ''}`, exerciserUuid: payload.uuid || '', firstName: payload.firstName || '' });
    setConfig((current) => ({ ...current, clubUuid: payload.homeClubUuid || current.clubUuid }));
    await loadHome();
  };

  const contextValue = useMemo(() => ({
    config, setConfig, auth, setAuth, loginForm, setLoginForm, classes, schedule, checkIns, gymBusyness, profile, setProfile, challenges, log, status, classWindow, setClassWindow, isAuthed,
    run, login, loadHome, loadSchedule, loadClasses, loadChallenges, bookingAction, setGymBusyness
  }), [config, auth, loginForm, classes, schedule, checkIns, gymBusyness, profile, challenges, log, status, classWindow, isAuthed]);

  return (
    <GymAppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isAuthed ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuthed ? '/' : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </GymAppContext.Provider>
  );
}
