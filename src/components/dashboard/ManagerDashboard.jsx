import React, { useState } from "react";

export const ManagerDashboard = ({
  selectedUser,
  teamEmployeeMetrics = [],
  teamCourseMetrics = [],
  getGradient,
  onAddTeamMember,
  onCreateCourse,
  addingMember = false,
  creatingCourse = false
}) => {
  // Add Subordinate local states
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPassword, setNewMemberPassword] = useState("");
  const [newMemberDept, setNewMemberDept] = useState("");

  // Add Course local states
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("Engineering");
  const [newCourseLevel, setNewCourseLevel] = useState("beginner");
  const [newCourseModTitle, setNewCourseModTitle] = useState("");
  const [newCourseModDuration, setNewCourseModDuration] = useState("");

  const submitAddMember = (e) => {
    e.preventDefault();
    onAddTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      password: newMemberPassword,
      department: newMemberDept
    }, () => {
      // Success callback to clear inputs
      setNewMemberName("");
      setNewMemberEmail("");
      setNewMemberPassword("");
      setNewMemberDept("");
    });
  };

  const submitCreateCourse = (e) => {
    e.preventDefault();
    onCreateCourse({
      title: newCourseTitle,
      description: newCourseDesc,
      category: newCourseCategory,
      level: newCourseLevel,
      moduleTitle: newCourseModTitle,
      moduleDuration: newCourseModDuration
    }, () => {
      // Success callback to clear inputs
      setNewCourseTitle("");
      setNewCourseDesc("");
      setNewCourseModTitle("");
      setNewCourseModDuration("");
      setNewCourseCategory("Engineering");
      setNewCourseLevel("beginner");
    });
  };

  const teamAvgProgress = teamEmployeeMetrics.length > 0 
    ? Math.round(teamEmployeeMetrics.reduce((acc, c) => acc + c.averageProgress, 0) / teamEmployeeMetrics.length) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero Greeting & Stats */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-850 dark:from-slate-955 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-violet-650 flex items-center justify-center text-white text-3xl font-extrabold shadow-md uppercase">
              {selectedUser.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Manager Insights: {selectedUser.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-200 border border-violet-500/30">
                  Manager Track
                </span>
              </div>
              <p className="text-sm text-slate-350 dark:text-slate-400 mt-1">
                Department: <span className="font-semibold text-white">{selectedUser.department}</span> &bull; Status: <span className="font-semibold text-white">Authorised Admin Insights</span>
              </p>
              <p className="text-xs text-violet-300 font-semibold mt-2">
                ⚡ Fetched direct MongoDB aggregate metrics for subordinates reporting to this manager.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div className="p-2 text-center sm:text-left">
              <div className="text-lg font-bold text-violet-400">{teamEmployeeMetrics.length}</div>
              <div className="text-[10px] text-slate-455 uppercase font-bold">Subordinates</div>
            </div>
            <div className="p-2 text-center sm:text-left">
              <div className="text-lg font-bold text-indigo-400">{teamCourseMetrics.length}</div>
              <div className="text-[10px] text-slate-455 uppercase font-bold">Active Courses</div>
            </div>
            <div className="p-2 text-center sm:text-left">
              <div className="text-lg font-bold text-emerald-455">{teamAvgProgress}%</div>
              <div className="text-[10px] text-slate-455 uppercase font-bold">Team Avg Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Manager Split Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Team Course Completion metrics & Course deploy form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Course completion stats card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Team Course Completion Rates</h3>
              <p className="text-xs text-slate-500">Aggregated database insights grouped by active course curriculum.</p>
            </div>

            {teamCourseMetrics.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center italic">No courses currently being completed by your team members.</p>
            ) : (
              <div className="space-y-5">
                {teamCourseMetrics.map((course) => (
                  <div key={course.courseId} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{course.courseTitle} ({course.category})</span>
                      <span className="font-semibold text-slate-500">
                        {course.completedCount} / {course.enrolledCount} Finished
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${getGradient(course.category)}`} style={{ width: `${course.averageCompletionRate}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 w-10 text-right">{course.averageCompletionRate}%</span>
                    </div>
                    <p className="text-[10px] text-slate-450">Team average across {course.enrolledCount} enrolled employees.</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create New Course Deployer Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create & Deploy New Course</h3>
              <p className="text-xs text-slate-500">Deploy a custom training course program for all department team members.</p>
            </div>

            <form onSubmit={submitCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advanced Docker for Engineers"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      className="w-full px-2 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Design">Design</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400 mb-1">
                      Level
                    </label>
                    <select
                      value={newCourseLevel}
                      onChange={(e) => setNewCourseLevel(e.target.value)}
                      className="w-full px-2 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400 mb-1">
                  Course Description
                </label>
                <textarea
                  required
                  rows="2"
                  placeholder="Write a brief summary of course topics, target learning tracks, and overall engineering scopes..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-450 mb-1">
                    First Module Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Introduction and Containerization Setup"
                    value={newCourseModTitle}
                    onChange={(e) => setNewCourseModTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-455 mb-1">
                    Lesson Duration (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    value={newCourseModDuration}
                    onChange={(e) => setNewCourseModDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingCourse}
                className="w-full py-2 bg-violet-650 hover:bg-violet-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                {creatingCourse ? "Deploying Course..." : "Deploy Course to Department"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Individual team members progress table & Add member option */}
        <div className="space-y-6">
          
          {/* Team Members List Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Team Members</h3>
              <p className="text-xs text-slate-505">Progress metrics for direct reports reporting to you.</p>
            </div>

            {teamEmployeeMetrics.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center italic">You have no employees reporting to you in this department.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[350px] overflow-y-auto pr-1">
                {teamEmployeeMetrics.map((emp) => (
                  <div key={emp.employeeId} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{emp.employeeName}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{emp.averageProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${emp.averageProgress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-505">
                        <span>{emp.enrolledCount} Active Enrolled</span>
                        <span>{emp.completedCount} Completed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Team Member Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Team Member</h3>
              <p className="text-xs text-slate-500">Add an employee directly under your direct reports track.</p>
            </div>

            <form onSubmit={submitAddMember} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane.doe@techcorp.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  placeholder={`Default: ${selectedUser.department}`}
                  value={newMemberDept}
                  onChange={(e) => setNewMemberDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-105"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400 mb-1">
                  Assign Password
                </label>
                <input
                  type="text"
                  placeholder="Default: password123"
                  value={newMemberPassword}
                  onChange={(e) => setNewMemberPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={addingMember}
                className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                {addingMember ? "Adding Member..." : "Add Subordinate"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
