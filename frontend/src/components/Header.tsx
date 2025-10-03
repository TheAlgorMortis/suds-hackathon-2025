import "./Header.css";
import "./Bodies.css";
import { NavLink } from "react-router-dom";

interface HeaderProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}
export default function Header({ username, setUsername }: HeaderProps) {
  return (
    <header>
      <div className="header desktopHeader">
        <h1 className="xCol"> Welcome to </h1>
        <Title />
        <LoginBlock username={username} setUsername={setUsername} />
      </div>
      <NavArea />
    </header>
  );
}

function Title() {
  return (
    <div className="titleGroup">
      <h1 className="title">Maroonit</h1>
      <h2 className="xCol"> Home of the Squirrels </h2>
    </div>
  );
}

function LoginBlock({ username, setUsername }: HeaderProps) {
  const handleLogin = () => {
    navigate("/login", { replace: true });
  };

  const handleLogout = () => {
    setUsername("");
    navigate("/", { replace: true });
  };

  if (username == "") {
    return (
      <div className="titleGroup">
        <button className="userButton" onClick={handleLogin}>
          Log In
        </button>
      </div>
    );
  } else {
    return (
      <div className="titleGroup">
        <p> Logged in as {username} </p>
        <button className="userButton" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    );
  }
}

function NavArea() {
  return (
    <div className="navGroup">
      <nav className="nav">
        <NavLink to="/" end className="navButton">
          Home
        </NavLink>
        <NavLink to="/module" className="navButton">
          Modules
        </NavLink>
        <NavLink to="/login" className="navButton">
          Login
        </NavLink>
      </nav>
    </div>
  );
}
