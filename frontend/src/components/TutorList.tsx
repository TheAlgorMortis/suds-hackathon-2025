import type { Tutor } from "../types";
import { useEffect, useState } from "react";
import { getTutors } from "../api/moduleApi";
import { useNavigate } from "react-router-dom";
import "./Bodies.css";

interface TutorListProps {
  moduleId;
}

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
        if (!cancelled) setTutors([]); // show empty state on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  if (loading) return <div>Loading tutors…</div>;
  if (!tutors || tutors.length === 0) return <div>No tutors yet.</div>;

  return (
    <div>
      {tutors.map((tutor) => (
        <TutorBlock key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}

interface TutorBlockProps {
  tutor: Tutor;
}

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
      <button
        onclick={() => {
          navTo(tutor.username);
        }}
      >
        {" "}
        {tutor.username}{" "}
      </button>
      <h2> {tutor.name} </h2>
      <p> {tutor.description} </p>
      <p> R{tutor.hourlyRate} per hour </p>
      <div>
        <h3>{tutor.email}</h3>
        <button
          onClick={() => {
            handleClick(tutor.email);
          }}
        >
          {" "}
          Enquire Now!{" "}
        </button>
      </div>
    </div>
  );
}
