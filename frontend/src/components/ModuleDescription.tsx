import type { Module, Req } from "../types";
import { ReqString } from "../types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Rater from "./Rater.tsx";
import "./Bodies.css";

interface ModuleDescriptionProps {
  module: Module;
}

export default function ModuleDescription({ module }: ModuleDescriptionProps) {
  const { code } = useParams<{ code: string }>();
  if (!code) return <p>Invalid module for the modules page</p>;

  return (
    <div className="sectionBlock">
      <h2 className="sectionHeading">
        {module.code}: {module.name}
      </h2>
      <p> {module.description} </p>
      <h3 className="sectionBlockHeading">
        Rating:
        <Rater
          initialRating={module.rating}
          setFunction={(c) => {}}
          editable={false}
        />
      </h3>
      <div className="flexRow">
        <h3 className="sectionBlockHeading">
          {" "}
          {module.lectureHours} lecture hours per week
        </h3>
        <h3 className="sectionBlockHeading">
          {" "}
          {module.tutHours} tutorial hours per week
        </h3>
      </div>
      <RequisiteList reqs={module.reqs} />
    </div>
  );
}

interface RequisiteListProps {
  reqs: Req[];
}

/**
 * List of requisites in the module
 */
function RequisiteList({ reqs }: RequisiteListProps) {
  const navigate = useNavigate();
  const navTo = (code: string) => {
    navigate(`/modules/${code}`, { replace: true });
  };

  if (reqs.length === 0) {
    return;
  }

  return (
    <div>
      <h3 className="sectionBlockHeading"> Requisites </h3>
      {reqs.map((req) => (
        <h4>
          {ReqString[req.type]}:
          <button
            className="outerButton"
            onClick={() => {
              navTo(req.code);
            }}
          >
            {req.code}
          </button>{" "}
        </h4>
      ))}
    </div>
  );
}
