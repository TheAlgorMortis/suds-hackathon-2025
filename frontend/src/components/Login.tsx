import React, { useState } from "react";
import { authLogin } from "../api/userApi.tsx";
import type { LoginResponse } from "../types.ts";
import "./Bodies.css";
import { useNavigate } from "react-router-dom";

type ShowPassword = "password" | "text";

interface LoginProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export default function Login({ setUsername }: LoginProps) {
  const navigate = useNavigate();
  const [editUsername, setEditUsername] = useState<string>("");
  const [editPassword, setEditPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<ShowPassword>("password");
  const [error, setError] = useState<string>("");

  /**
   * Called when the login button is clicked
   */
  const handleLogin = async () => {
    setError("");
    const username = (editUsername ?? "").trim();

    if (username === "") {
      setError("Please enter a valid username");
      return;
    }

    let loginResponse: LoginResponse = await authLogin(username, editPassword);

    if (loginResponse.success) {
      // Log in and navigate to home
      setUsername(username);
      navigate("/", { replace: true });
    } else {
      setError(loginResponse.message);
    }
  };

  const passwordCaption =
    showPassword === "password" ? "show password" : "hide password";

  return (
    <>
      <h2 className="sectionHeading">Login</h2>

      <div className="sectionBlock">
        <h3>Username</h3>
        <input
          className="searchBar"
          type="text"
          value={editUsername}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditUsername(e.target.value)
          }
          placeholder="Enter username"
        />

        <h3>Password</h3>
        <input
          className="searchBar"
          type={showPassword}
          value={editPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditPassword(e.target.value)
          }
          placeholder="Enter password"
        />

        <button
          className="outerButton"
          onClick={() =>
            setShowPassword((prev) =>
              prev === "password" ? "text" : "password",
            )
          }
        >
          {passwordCaption}
        </button>
      </div>

      {error && (
        <div className="sectionSubHeading">
          <h2>{error}</h2>
        </div>
      )}

      <button className="outerButton" onClick={handleLogin}>
        <h2>Login</h2>
      </button>
    </>
  );
}
