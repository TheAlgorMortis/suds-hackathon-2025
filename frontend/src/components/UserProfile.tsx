import { useEffect, useState } from "react";
import { LuNut } from "react-icons/lu";
import "./Bodies.css";
import { StatusString } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import type { ModuleStatus } from "../types";
import { getUserInfo } from "../api/moduleApi.ts";
import Rater from "./Rater";

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const handleClick = (email: string) => {
    const mailtoLink = `mailto:${email}`;
    window.open(mailtoLink, "_blank");
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setUserInfo(null);

    (async () => {
      try {
        const data = await getUserInfo(username);
        if (!cancelled) setUserInfo(data);
      } catch (e) {
        console.error("Failed to load user info:", e);
        if (!cancelled) setUserInfo(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) return <div>Loading user info...</div>;
  if (!userInfo) return <div>No user info found.</div>;

  return (
    <div>
      <h2 className="sectionHeading">
        {userInfo.name} ({username})
      </h2>

      <div className="sectionBlock">
        <div className="subtitleRow">
          <h3>Email: {userInfo.email}</h3>
          <button
            className="userButton"
            onClick={() => handleClick(userInfo.email)}
          >
            Get in Contact
          </button>
        </div>
      </div>

      <h3 className="sectionHeading">
        <LuNut />
        {userInfo.totalVotes} Acorns
      </h3>

      <div className="sectionBlock">
        <h3 className="sectionBlockHeading">Module History</h3>
        {userInfo.takingModules.map((mod) => (
          <ModuleRelation
            key={mod.code}
            code={mod.code}
            nme={mod.name}
            status={mod.status}
            rating={null}
          />
        ))}
      </div>

      <div className="sectionBlock">
        <h3 className="sectionBlockHeading">Ratings</h3>
        {userInfo.reviews.map((mod) => (
          <ModuleRelation
            key={mod.code}
            code={mod.code}
            nme={mod.name}
            status={null}
            rating={mod.rating}
          />
        ))}
      </div>

      <div className="sectionBlock">
        <h3 className="sectionBlockHeading">Tutoring Modules</h3>
        {userInfo.tutoringModules.map((mod) => (
          <ModuleRelation
            key={mod.code}
            code={mod.code}
            nme={mod.name}
            status={null}
            rating={null}
          />
        ))}
      </div>
    </div>
  );
}
interface ModuleRelationProps {
  code: string;
  nme: string;
  status: ModuleStatus;
  rating: Number;
}

function ModuleRelation({ code, nme, status, rating }: ModuleRelationProps) {
  const navigate = useNavigate();
  const navTo = (code) => {
    navigate(`/modules/${code}`, { replace: true });
  };

  return (
    <div className="subtitleRow">
      <button
        className="outerButton"
        onClick={() => {
          navTo(code);
        }}
      >
        {code}: {nme}
      </button>
      {status && <h2 className="flexOne">{StatusString[status]}</h2>}
      {rating && (
        <Rater
          initialRating={rating}
          setFunction={(b) => {}}
          editable={false}
        />
      )}
    </div>
  );
}
