import { Module, Req } from "../types.ts";
import type { ReqString } from "../types.ts";
import { useNavigate } from "react-router-dom";
import "./Bodies.css";

interface ModuleDescriptionProps {
  module: Module;
}

export default function ModuleDescription({
  username,
}: ModuleDescriptionProps) {
  const { code } = useParams<{ code: string }>();
  if (!code) return <p>Invalid module for the modules page</p>;

  return (
    <div className="sectionBlock">
      <h2>
        {" "}
        {module.code}: {module.name}{" "}
      </h2>
      <Rating stars={module.rating} />
      <h3> Description </h3>
      <p> {module.description} </p>
      <h3> Requisites </h3>
      <RequisiteList reqs={module.reqs} />
    </div>
  );
}

interface RequisiteListProps {
  reqs: Req[];
}

function RequisiteList({ reqs }: RequisiteListProps) {
  const navigate = useNavigate();
  const navTo = (code) => {
    navigate(`/modules/${code}`, { replace: true });
  };

  return (
    <div>
      {reqs.map((req) => (
        <>
          <h4> {ReqString[req.type]}: </h4>
          <button onClick={()=>{navTo(req.code)}}> {req.code} <button />
        </>
      ))}
    </div>
  );
}
