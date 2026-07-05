import React from "react";
import { Loader } from "./components/common/Loader";
import { ErrorBanner } from "./components/common/ErrorBanner";
import { LoginScreen } from "./components/auth/LoginScreen";
import { LearnerDashboard } from "./components/dashboard/LearnerDashboard";
import { ManagerDashboard } from "./components/dashboard/ManagerDashboard";
import { useLms } from "./hooks/useLms";

function App() {
  const lms = useLms();

  // --- Main Render Gate ---
  if (!lms.isLoggedIn || !lms.selectedUser) {
    return (
      <LoginScreen
        users={lms.users}
        authLoading={lms.authLoading}
        loginError={lms.loginError}
        regLoading={lms.regLoading}
        regError={lms.regError}
        onLogin={lms.handleLogin}
        onRegister={lms.handleRegister}
        clearErrors={lms.clearErrors}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              TechCorp Corporate LMS
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <div className="text-right">
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">{lms.selectedUser.name}</p>
              <p className="text-[10px] text-slate-505 capitalize">{lms.selectedUser.role} &bull; {lms.selectedUser.department}</p>
            </div>
            <button
              onClick={lms.handleLogout}
              className="px-3.5 py-1.5 bg-slate-105 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all text-slate-700 dark:text-slate-255 active:scale-95 shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Banner */}
        {lms.error && <ErrorBanner error={lms.error} onReconnect={lms.fetchUsers} />}

        {/* Loading Skeletons */}
        {lms.loading && <Loader />}

        {/* Dashboards Main Render */}
        {!lms.loading && !lms.error && (
          <>
            {lms.selectedUser.role === "learner" && (
              <LearnerDashboard
                selectedUser={lms.selectedUser}
                courses={lms.courses}
                progressRecords={lms.progressRecords}
                activeCourseId={lms.activeCourseId}
                setActiveCourseId={lms.setActiveCourseId}
                quizSubmittedResult={lms.quizSubmittedResult}
                setQuizSubmittedResult={lms.setQuizSubmittedResult}
                handleEnroll={lms.handleEnroll}
                handleCompleteModule={lms.handleCompleteModule}
                handleQuizSubmit={lms.handleQuizSubmit}
                getGradient={lms.getGradient}
              />
            )}

            {lms.selectedUser.role === "manager" && (
              <ManagerDashboard
                selectedUser={lms.selectedUser}
                teamEmployeeMetrics={lms.teamEmployeeMetrics}
                teamCourseMetrics={lms.teamCourseMetrics}
                getGradient={lms.getGradient}
                onAddTeamMember={lms.handleAddTeamMember}
                onCreateCourse={lms.handleCreateCourse}
                addingMember={lms.addingMember}
                creatingCourse={lms.creatingCourse}
              />
            )}
          </>
        )}
        
      </div>
    </div>
  );
}

export default App;
