import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header.tsx";
import Home from "./components/Home.tsx";
import Login from "./components/Login.tsx";
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
        <main>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />
            {/* Home Page */}
            <Route
              path="/login" // <- use same casing as your NavLink
              element={<Login setUsername={setUsername} />}
            />
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
