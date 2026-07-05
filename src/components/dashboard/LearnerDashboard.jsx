import React, { useState } from "react";

export const LearnerDashboard = ({
  selectedUser,
  courses = [],
  progressRecords = [],
  activeCourseId,
  setActiveCourseId,
  quizSubmittedResult,
  setQuizSubmittedResult,
  handleEnroll,
  handleCompleteModule,
  handleQuizSubmit,
  getGradient
}) => {
  // Local UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState({});

  // Helpers to divide courses into Enrolled vs Recommended
  const getEnrolledCourses = () => {
    return progressRecords.map(pr => {
      const course = courses.find(c => c._id === pr.course?._id) || pr.course;
      if (!course) return null;
      return {
        ...course,
        progress: pr.completionPercentage,
        completedModules: pr.completedModules,
        isCompleted: pr.isCompleted,
        quizAttempts: pr.quizAttempts,
        lastAccessedAt: pr.lastAccessedAt
      };
    }).filter(Boolean);
  };

  const getRecommendedCourses = () => {
    const enrolledIds = progressRecords.map(pr => pr.course?._id);
    return courses.filter(c => !enrolledIds.includes(c._id));
  };

  // Filter lists based on Search & category tabs
  const filterList = (list) => {
    return list.filter(item => {
      const titleMatches = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const catMatches = selectedCategory === "All" || item.category === selectedCategory;
      return titleMatches && catMatches;
    });
  };

  const enrolledList = getEnrolledCourses();
  const recommendedList = getRecommendedCourses();
  const completedList = enrolledList.filter(c => c.isCompleted);
  const averageCompletion = enrolledList.length > 0 
    ? Math.round(enrolledList.reduce((acc, c) => acc + c.progress, 0) / enrolledList.length) 
    : 0;

  const activeCourse = enrolledList.find(c => c._id === activeCourseId);

  const onAnswerChange = (questionIndex, optionIndex) => {
    setSelectedQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const onQuizFormSubmit = (e) => {
    e.preventDefault();
    if (!activeCourse || !activeCourse.quizzes) return;
    
    // Check that all questions are answered
    const unanswered = activeCourse.quizzes.some((_, idx) => selectedQuizAnswers[idx] === undefined);
    if (unanswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    handleQuizSubmit(activeCourseId, selectedQuizAnswers, () => {
      setSelectedQuizAnswers({});
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Greeting & Stats */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-850 dark:from-slate-955 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md uppercase">
              {selectedUser.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Welcome, {selectedUser.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                  Learner Track
                </span>
              </div>
              <p className="text-sm text-slate-355 dark:text-slate-400 mt-1">
                Department: <span className="font-semibold text-white">{selectedUser.department}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div className="p-2 text-center sm:text-left">
              <div className="text-lg font-bold text-indigo-400">{enrolledList.length}</div>
              <div className="text-[10px] text-slate-450 uppercase font-bold">Enrolled</div>
            </div>
            <div className="p-2 text-center sm:text-left">
              <div className="text-lg font-bold text-violet-400">{completedList.length}</div>
              <div className="text-[10px] text-slate-450 uppercase font-bold">Completed</div>
            </div>
            <div className="p-2 text-center sm:text-left">
              <div className="text-lg font-bold text-emerald-405">{averageCompletion}%</div>
              <div className="text-[10px] text-slate-450 uppercase font-bold">Avg Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab controls & Search bar (Only display when not in detailed course view) */}
      {!activeCourseId && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto">
            {["All", "Engineering", "Architecture", "Design", "Security"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-xs bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Learning modules / courses */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeCourseId && activeCourse ? (
            /* DETAILED ACTIVE PLAYER VIEW */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <button
                    onClick={() => {
                      setActiveCourseId(null);
                      setQuizSubmittedResult(null);
                      setSelectedQuizAnswers({});
                    }}
                    className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-1"
                  >
                    &larr; Back to Dashboard
                  </button>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{activeCourse.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{activeCourse.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400`}>
                    {activeCourse.level}
                  </span>
                  <div className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">Progress: {activeCourse.progress}%</div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${getGradient(activeCourse.category)}`} style={{ width: `${activeCourse.progress}%` }}></div>
              </div>

              {/* Modules Listing */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Course Curriculum Modules</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-955/30">
                  {activeCourse.modules?.map((mod, index) => {
                    const isCompleted = activeCourse.completedModules?.includes(mod._id);
                    return (
                      <div key={mod._id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="text-xs font-bold text-slate-400 mt-0.5">#{index + 1}</div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">{mod.title}</h4>
                            <p className="text-[10px] text-slate-505">{mod.duration} minutes bookmark lesson</p>
                          </div>
                        </div>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
                            ✓ Done
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCompleteModule(activeCourseId, mod._id)}
                            className="px-3 py-1 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold shadow-sm transition-colors text-slate-800 dark:text-slate-200"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COMPLIANCE QUIZ AREA */}
              {activeCourse.quizzes && activeCourse.quizzes.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compliance Evaluation Quiz</h3>
                      <p className="text-[11px] text-slate-500">Required to unlock credential certificate (Pass rate: 100%).</p>
                    </div>
                    {activeCourse.isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600">
                        Passed & Verified
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-505">Attempt Count: {activeCourse.quizAttempts?.length || 0}</span>
                    )}
                  </div>

                  {quizSubmittedResult && (
                    <div className={`p-4 rounded-2xl border text-xs font-semibold ${
                      quizSubmittedResult.success 
                        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-605" 
                        : "bg-red-50 dark:bg-red-955/20 border-red-200 dark:border-red-900/50 text-red-650"
                    }`}>
                      {quizSubmittedResult.success 
                        ? `🎉 Congratulations! You scored ${quizSubmittedResult.score}%. Course compliance completed!` 
                        : `❌ Evaluation Failed (${quizSubmittedResult.score}%). You must answer all questions correctly to pass. Try again.`
                      }
                    </div>
                  )}

                  {!activeCourse.isCompleted && (
                    <form onSubmit={onQuizFormSubmit} className="space-y-4">
                      {activeCourse.quizzes.map((quiz, qIdx) => (
                        <div key={qIdx} className="p-4 bg-slate-50 dark:bg-slate-950/45 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-2">
                          <p className="text-xs font-bold text-slate-850 dark:text-slate-205">{qIdx + 1}. {quiz.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {quiz.options.map((opt, oIdx) => (
                              <label
                                key={oIdx}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                                  selectedQuizAnswers[qIdx] === oIdx
                                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-305 text-indigo-650 dark:text-indigo-400"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${qIdx}`}
                                  checked={selectedQuizAnswers[qIdx] === oIdx}
                                  onChange={() => onAnswerChange(qIdx, oIdx)}
                                  className="sr-only"
                                />
                                <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  selectedQuizAnswers[qIdx] === oIdx
                                    ? "border-indigo-600 bg-indigo-600 text-white text-[8px]"
                                    : "border-slate-300 bg-white"
                                }`}>
                                  {selectedQuizAnswers[qIdx] === oIdx && "✓"}
                                </span>
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-700 hover:to-violet-750 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        Submit Compliance Quiz
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* LISTINGS VIEW */
            <>
              {/* Active Enrollments */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Active Enrollments</h3>
                {filterList(enrolledList).length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-6 text-center bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl">
                    No active course enrollments match the filter. Enroll in a course below to begin.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterList(enrolledList).map((course) => (
                      <div key={course._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4 group">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400`}>
                              {course.category}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize">{course.level}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-150 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{course.title}</h4>
                          <p className="text-[10px] text-slate-550 line-clamp-2">{course.description}</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-800 dark:text-slate-205">
                            <span>Progress: {course.progress}%</span>
                            {course.isCompleted && <span className="text-emerald-500">✓ Compliance Passed</span>}
                          </div>
                          <div className="h-1.5 w-full bg-slate-150 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${getGradient(course.category)}`} style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <button
                            onClick={() => setActiveCourseId(course._id)}
                            className="w-full py-1.5 bg-slate-50 hover:bg-indigo-650 hover:text-white dark:bg-slate-955 dark:hover:bg-indigo-650 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold transition-all"
                          >
                            {course.progress === 0 ? "Start Learning" : "Resume Learning"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Courses */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Recommended for Career Growth</h3>
                {filterList(recommendedList).length === 0 ? (
                  <p className="text-xs text-slate-505 py-6 text-center bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-855 rounded-3xl italic">
                    All courses registered in the department are currently active in your dashboard.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterList(recommendedList).map((course) => (
                      <div key={course._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4 group">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300`}>
                              {course.category}
                            </span>
                            <span className="text-[10px] text-slate-455 capitalize">{course.level}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-150 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{course.title}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2">{course.description}</p>
                        </div>
                        <div className="flex justify-between items-center gap-4 pt-2">
                          <span className="text-[10px] font-bold text-slate-455">{course.modules?.length || 0} Lessons &bull; Quiz</span>
                          <button
                            onClick={() => handleEnroll(course._id)}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold shadow-sm transition-all"
                          >
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right 1 Column: Calendar, deadlines, certificates */}
        <div className="space-y-6">
          
          {/* Earned Certificates */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="h-4.5 w-4.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Earned Certificates</span>
            </h3>
            {completedList.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Complete 100% of modules in active courses and pass the compliance exams to unlock verified certificates.
              </p>
            ) : (
              <div className="space-y-3">
                {completedList.map(course => (
                  <div key={course._id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-155 line-clamp-1">{course.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Credential ID: COMP-LMS-{course._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <span className="p-1 text-emerald-500 font-bold text-xs shrink-0">Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Static Calendar Events */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="h-4.5 w-4.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Upcoming Deadlines</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="border-l-2 border-amber-500 pl-3">
                <div className="font-bold text-slate-850 dark:text-slate-200">MDB Aggregate Exam Deadline</div>
                <div className="text-[10px] text-slate-500">July 18, 2026 &bull; Required Track</div>
              </div>
              <div className="border-l-2 border-red-500 pl-3">
                <div className="font-bold text-slate-850 dark:text-slate-200">Corporate Security Compliance</div>
                <div className="text-[10px] text-slate-500">July 25, 2026 &bull; Engineering Core</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
