import React, { useState } from "react";
import "./Bodies.css";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

type ShowPassword = "password" | "text";

interface LoginProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

  // local state
  const [editUsername, setEditUsername] = useState<string>("");
  const [editPassword, setEditPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<ShowPassword>("password");
  const [error, setError] = useState<string>("");

  /**
   * Called when the login button is clicked
   */
  const handleLogin = () => {
    setError("");
    const username = (editUsername ?? "").trim();

    // TODO: Wire up to axios

    if (username === "") {
      setError("Please enter a valid username");
      return;
    }

    // Api call to server to check if the user exists
    if (userExists(username)) {
      setError("Account with this username does not exist.");
      return;
    }

    // Check the password
    if (editPassword === globals.getPassword(username)) {
      // Log in and navigate to home
      setUsername(username);
      navigate("/", { replace: true });
    } else {
      setError("Password is incorrect for this username.");
    }
  };

  const passwordCaption =
    showPassword === "password" ? "show password" : "hide password";

  return (
    <>
      <h1 className="sectionHeading">Login</h1>

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
