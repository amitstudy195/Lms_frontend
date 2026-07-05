import { useState, useEffect } from "react";

export const useLms = () => {
  // Demo data lists
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);

  // Auth & Session states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  // Dashboard general states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active Learner states
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [quizSubmittedResult, setQuizSubmittedResult] = useState(null);

  // Active Manager states
  const [teamCourseMetrics, setTeamCourseMetrics] = useState([]);
  const [teamEmployeeMetrics, setTeamEmployeeMetrics] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  const [creatingCourse, setCreatingCourse] = useState(false);

  // Helper to fetch authorization headers dynamically
  const getAuthHeaders = () => {
    const token = localStorage.getItem("lms_token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // Check local session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("lms_user");
    const savedToken = localStorage.getItem("lms_token");
    if (savedUser && savedToken) {
      setSelectedUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    fetchUsers();
  }, []);

  // Fetch dashboard data when user switches or logs in
  useEffect(() => {
    if (!selectedUser || !isLoggedIn) return;

    setLoading(true);
    setError(null);
    setActiveCourseId(null);
    setQuizSubmittedResult(null);

    const headers = getAuthHeaders();

    if (selectedUser.role === "learner") {
      Promise.all([
        fetch("/api/courses", { headers }),
        fetch("/api/progress/my-learning", { headers })
      ])
        .then(async ([coursesRes, progressRes]) => {
          if (!coursesRes.ok || !progressRes.ok) {
            throw new Error("Failed to load learner dashboard data");
          }
          const coursesData = await coursesRes.json();
          const progressData = await progressRes.json();
          setCourses(coursesData.data || []);
          setProgressRecords(progressData.data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else if (selectedUser.role === "manager") {
      Promise.all([
        fetch("/api/manager/insights/courses", { headers }),
        fetch("/api/manager/insights/employees", { headers })
      ])
        .then(async ([coursesMetricRes, employeesMetricRes]) => {
          if (!coursesMetricRes.ok || !employeesMetricRes.ok) {
            throw new Error("Failed to load manager insights data");
          }
          const courseData = await coursesMetricRes.json();
          const employeeData = await employeesMetricRes.json();
          setTeamCourseMetrics(courseData.data || []);
          setTeamEmployeeMetrics(employeeData.data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [selectedUser, isLoggedIn]);

  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((resData) => {
        setUsers(resData.data || []);
      })
      .catch((err) => {
        console.warn("Seeded user loader failed:", err.message);
      });
  };

  // --- Auth Handlers ---

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid email or password");

      localStorage.setItem("lms_user", JSON.stringify(data.data));
      localStorage.setItem("lms_token", data.token);
      setSelectedUser(data.data);
      setIsLoggedIn(true);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lms_user");
    localStorage.removeItem("lms_token");
    setSelectedUser(null);
    setIsLoggedIn(false);
  };

  const handleRegister = async (payload, onSuccess) => {
    setRegLoading(true);
    setRegError("");
    try {
      const body = {
        name: payload.name.trim(),
        email: payload.email.trim(),
        password: payload.password.trim(),
        department: payload.department.trim()
      };

      if (payload.role === "manager") {
        body.managerPasscode = payload.managerPasscode.trim();
      } else if (payload.managerId) {
        body.manager = payload.managerId;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || data.error || "Registration failed");

      localStorage.setItem("lms_user", JSON.stringify(data.data));
      localStorage.setItem("lms_token", data.token);
      setSelectedUser(data.data);
      setIsLoggedIn(true);

      if (onSuccess) onSuccess();
      fetchUsers();
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  // --- Learner CRUD Handlers ---

  const handleEnroll = async (courseId) => {
    try {
      const headers = getAuthHeaders();

      const res = await fetch(`/api/progress/enroll/${courseId}`, {
        method: "POST",
        headers
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to enroll in course");

      const progressRes = await fetch("/api/progress/my-learning", { headers });
      const progressData = await progressRes.json();
      setProgressRecords(progressData.data || []);

      alert(`Successfully enrolled in "${data.data.course?.title || "new course"}"!`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteModule = async (courseId, moduleId) => {
    try {
      const headers = getAuthHeaders();

      const res = await fetch(`/api/progress/${courseId}/complete-module`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ moduleId })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save module progress");

      const progressRes = await fetch("/api/progress/my-learning", { headers });
      const progressData = await progressRes.json();
      setProgressRecords(progressData.data || []);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuizSubmit = async (courseId, answers, onSuccess) => {
    try {
      const headers = getAuthHeaders();

      const res = await fetch(`/api/progress/${courseId}/submit-quiz`, {
        method: "POST",
        headers,
        body: JSON.stringify({ answers })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to grade quiz evaluation");

      setQuizSubmittedResult(data);

      const progressRes = await fetch("/api/progress/my-learning", { headers });
      const progressData = await progressRes.json();
      setProgressRecords(progressData.data || []);

      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- Manager CRUD Handlers ---

  const handleAddTeamMember = async (payload, onSuccess) => {
    setAddingMember(true);
    try {
      const headers = getAuthHeaders();
      const dept = payload.department.trim() || selectedUser.department;
      const pass = payload.password.trim() || "password123";

      const res = await fetch("/api/users", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: payload.name.trim(),
          email: payload.email.trim(),
          password: pass,
          role: "learner",
          manager: selectedUser._id,
          department: dept
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add team member");

      if (onSuccess) onSuccess();
      fetchUsers();

      const employeesMetricRes = await fetch("/api/manager/insights/employees", { headers });
      const employeeData = await employeesMetricRes.json();
      setTeamEmployeeMetrics(employeeData.data || []);

      alert(`Subordinate ${data.data.name} added successfully! Assigned Password: ${pass}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingMember(false);
    }
  };

  const handleCreateCourse = async (payload, onSuccess) => {
    setCreatingCourse(true);
    try {
      const headers = getAuthHeaders();
      const duration = parseInt(payload.moduleDuration) || 30;

      const res = await fetch("/api/courses", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: payload.title.trim(),
          description: payload.description.trim(),
          category: payload.category,
          level: payload.level,
          modules: [
            {
              title: payload.moduleTitle.trim() || "Course Introduction",
              duration: duration,
              order: 1
            }
          ],
          quizzes: [
            {
              question: `What is the primary topic of ${payload.title.trim()}?`,
              options: [payload.category, "General Studies", "Administration", "Compliance"],
              correctOptionIndex: 0,
              points: 10
            }
          ]
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to deploy new course");

      if (onSuccess) onSuccess();

      const coursesRes = await fetch("/api/courses", { headers });
      const coursesData = await coursesRes.json();
      setCourses(coursesData.data || []);

      const coursesMetricRes = await fetch("/api/manager/insights/courses", { headers });
      const courseData = await coursesMetricRes.json();
      setTeamCourseMetrics(courseData.data || []);

      alert(`Course "${data.data.title}" deployed successfully to department catalog!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreatingCourse(false);
    }
  };

  // Helper gradient generators based on course category
  const getGradient = (category) => {
    switch (category) {
      case "Engineering": return "from-blue-600 to-indigo-600";
      case "Architecture": return "from-indigo-600 to-purple-600";
      case "Design": return "from-pink-600 to-rose-600";
      case "Security": return "from-amber-500 to-orange-600";
      default: return "from-slate-600 to-slate-800";
    }
  };

  const clearErrors = () => {
    setLoginError("");
    setRegError("");
  };

  return {
    users,
    courses,
    progressRecords,
    selectedUser,
    isLoggedIn,
    authLoading,
    loginError,
    regLoading,
    regError,
    loading,
    error,
    activeCourseId,
    setActiveCourseId,
    quizSubmittedResult,
    setQuizSubmittedResult,
    teamCourseMetrics,
    teamEmployeeMetrics,
    addingMember,
    creatingCourse,
    handleLogin,
    handleLogout,
    handleRegister,
    handleEnroll,
    handleCompleteModule,
    handleQuizSubmit,
    handleAddTeamMember,
    handleCreateCourse,
    getGradient,
    clearErrors,
    fetchUsers
  };
};
