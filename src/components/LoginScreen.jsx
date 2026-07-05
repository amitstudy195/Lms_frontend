import React, { useState } from "react";

export const LoginScreen = ({
  users = [],
  authLoading = false,
  loginError = "",
  regLoading = false,
  regError = "",
  onLogin,
  onRegister,
  clearErrors
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Registration local states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("learner");
  const [regDept, setRegDept] = useState("Product Engineering");
  const [regManagerId, setRegManagerId] = useState("");
  const [regManagerPasscode, setRegManagerPasscode] = useState("");

  const managersList = users.filter((u) => u.role === "manager");

  const onSubmitLogin = (e) => {
    e.preventDefault();
    onLogin(emailInput, passwordInput);
  };

  const onSubmitRegister = (e) => {
    e.preventDefault();
    onRegister({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      department: regDept,
      managerId: regManagerId,
      managerPasscode: regManagerPasscode
    }, () => {
      // Success callback to clear local registration forms
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegRole("learner");
      setRegDept("Product Engineering");
      setRegManagerId("");
      setRegManagerPasscode("");
      setIsRegisterMode(false);
    });
  };

  const toggleMode = (register) => {
    setIsRegisterMode(register);
    clearErrors();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-955 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-250">
      {/* Branding Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <svg className="h-8 w-8 text-indigo-650 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>TechCorp LMS Portal</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Secure learning management system for engineers and managers
        </p>
      </div>

      {isRegisterMode ? (
        /* Register Card */
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-850 dark:text-white">Account Registration</h2>
            <p className="text-xs text-slate-500 mt-1">Deploy your profile credentials onto the LMS registry</p>
          </div>

          {regError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-semibold text-red-650 dark:text-red-400 animate-pulse">
              ⚠️ {regError}
            </div>
          )}

          <form onSubmit={onSubmitRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. sarah.j@techcorp.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1">
                Password (min 6 chars)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="regRoleCheckbox"
                checked={regRole === "manager"}
                onChange={(e) => {
                  const nextRole = e.target.checked ? "manager" : "learner";
                  setRegRole(nextRole);
                  clearErrors();
                }}
                className="h-4 w-4 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="regRoleCheckbox" className="text-xs font-bold text-slate-755 dark:text-slate-300 cursor-pointer select-none">
                Register as Supervising Manager
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  placeholder="Product Engineering"
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50  dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              {regRole === "manager" ? (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1">
                    Manager Secret Access Code
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="e.g. welcome_manager"
                    value={regManagerPasscode}
                    onChange={(e) => setRegManagerPasscode(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1">
                    Select Supervising Manager
                  </label>
                  <select
                    required
                    value={regManagerId}
                    onChange={(e) => setRegManagerId(e.target.value)}
                    className="w-full px-2.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  >
                    <option value="">-- Choose supervisor --</option>
                    {managersList.map((mgr) => (
                      <option key={mgr._id} value={mgr._id}>
                        {mgr.name} ({mgr.department})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={regLoading}
              className="w-full py-2.5 bg-gradient-to-r from-violet-650 to-indigo-650 hover:from-violet-750 hover:to-indigo-750 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              {regLoading ? "Registering profile..." : "Create Account"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => toggleMode(false)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      ) : (
        /* Login Card */
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-850 dark:text-white">Account Authentication</h2>
            <p className="text-xs text-slate-500 mt-1">Please sign in using your corporate credentials</p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-semibold text-red-655 dark:text-red-400">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={onSubmitLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. sarah.j@techcorp.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-700 hover:to-violet-750 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              {authLoading ? "Verifying Credentials..." : "Authenticate Session"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => toggleMode(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
            >
              New to the portal? Create an account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
