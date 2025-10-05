import type { Tutor } from "../types";
import { useEffect, useState } from "react";
import { getTutors } from "../api/moduleApi";
import { useNavigate } from "react-router-dom";
import "./Bodies.css";

interface TutorListProps {
  moduleId;
}

/**
 * List of Tutors for a module
 */
export default function TutorList({ moduleId }: TutorListProps) {
  const [tutors, setTutors] = useState<Tutor[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setTutors(null); // reset between module changes

    (async () => {
      try {
        const data = await getTutors(moduleId);
        if (!cancelled) setTutors(data);
      } catch (e) {
        console.error("Failed to load tutors:", e);
        if (!cancelled) setTutors([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  if (!tutors || tutors.length === 0)
    return <h1 className="sectionHeading">No tutors yet.</h1>;

  return (
    <div>
      <h3 className="sectionHeading"> Tutors </h3>
      {tutors.map((tutor) => (
        <TutorBlock key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}

interface TutorBlockProps {
  tutor: Tutor;
}

/**
 * Individual tutor advert block
 */
function TutorBlock({ tutor }: TutorBlockProps) {
  const navigate = useNavigate();
  const handleClick = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.open(mailtoLink, "_blank");
  };
  const navTo = (username) => {
    navigate(`/users/${username}`, { replace: true });
  };
  return (
    <div className="sectionBlock">
      <h2 className="sectionBlockHeading">
        {" "}
        {tutor.name} ({tutor.username}){" "}
      </h2>
      <p> {tutor.description} </p>
      <p> R{tutor.hourlyRate} per hour </p>
      <h3>{tutor.email}</h3>
      <div className="flexRow">
        <button
          className="outerButton"
          onClick={() => {
            handleClick(tutor.email);
          }}
        >
          Enquire Now!
        </button>
        <button
          className="outerButton"
          onclick={() => {
            navTo(tutor.username);
          }}
        >
          Visit User Profile
        </button>
      </div>
    </div>
  );
}
