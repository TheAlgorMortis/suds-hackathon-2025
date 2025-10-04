import { useParams } from "react-router-dom";

interface ModuleDetailsProps {
  username: string;
}

export default function ModuleDetails({ username }: ModuleDetailsProps) {
  const { code } = useParams<{ code: string }>();
  if (!code) return <p>Invalid module for the modules page</p>;

  return (
    <h1>
      Module {code}, user {username}
    </h1>
  );
}
