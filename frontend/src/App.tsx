import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header.tsx";
import Home from "./components/Home.tsx";
import Login from "./components/Login.tsx";
import ModuleDetails from "./components/ModuleDetails.tsx";
import ModuleList from "./components/ModuleList.tsx";
import UserProfile from "./components/UserProfile.tsx";
import "./App.css";

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem("MRNTusername" || ""),
  );
  localStorage.setItem("MRNTusername", username);
  return (
    <>
      <BrowserRouter>
        <Header username={username} setUsername={setUsername} />
        <main className="body">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />
            {/* Home Page */}
            <Route
              path="/login"
              element={<Login setUsername={setUsername} />}
            />

            {/* Modules */}
            <Route
              path="/modules"
              element={<ModuleList username={username} />}
            />
            <Route
              path="/modules/:code"
              element={<ModuleDetails username={username} />}
            />
            <Route path="/users/:username" element={<UserProfile />} />

            {/* None found */}
            <Route
              path="*"
              element={
                <h1>
                  Pokkel the squirrel couldn't find the page you were looking
                  for.
                </h1>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
