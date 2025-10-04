import "./Header.css";
import "./Bodies.css";
import { LuNut } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}
export default function Header({ username, setUsername }: HeaderProps) {
  return (
    <header>
      <div className="header">
        <div className="bigNut">
          <LuNut />
        </div>
        <Title />
        <NavArea />
        <LoginBlock username={username} setUsername={setUsername} />
      </div>
    </header>
  );
}

function Title() {
  return (
    <div className="titleGroup">
      <h1 className="title">Maroonut</h1>
      <h2 className="subtitle"> A Dylan Squared Project </h2>
    </div>
  );
}

/**
 * Part of the header responsible for users logging in
 */
function LoginBlock({ username, setUsername }: HeaderProps) {
  const navigate = useNavigate();

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
        <button className="loginLink" onClick={handleLogin}>
          Log In
        </button>
      </div>
    );
  } else {
    return (
      <div className="titleGroup">
        <p> Logged in as {username} </p>
        <button className="loginLink" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    );
  }
}

/**
 * Part of the header responsible for navigation
 */
function NavArea() {
  return (
    <div className="navGroup">
      <nav className="nav">
        <NavLink to="/" end className="navLink">
          Home
        </NavLink>
        <NavLink to="/modules" className="navLink">
          Modules
        </NavLink>
      </nav>
    </div>
  );
}
