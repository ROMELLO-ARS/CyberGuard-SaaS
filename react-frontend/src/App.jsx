import { useState } from "react";
import Login from "./pages/Login";

const [user, setUser] = useState(() => {
  const token = localStorage.getItem("cyberguard_token");
  const username = localStorage.getItem("cyberguard_user");
  const role = localStorage.getItem("cyberguard_role");

  if (!token) return null;

  return {
    token,
    username,
    role,
  };
});

if (!user) {
  return <Login onLogin={setUser} />;
}


<button
  onClick={() => {
    localStorage.clear();
    setUser(null);
  }}
  className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
>
  Logout
</button>





function App() {
  return <Login />;
    <div style={{ color: "white", padding: "40px" }}>
      <h1>CyberGuard Test</h1>
    </div>
  ;
}

export default App;