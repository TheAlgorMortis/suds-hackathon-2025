import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getModuleDetails } from "../api/moduleApi";
import ReviewList from "./ReviewList.tsx";
import ModuleDescription from "./ModuleDescription.tsx";
import { getReviews } from "../api/moduleApi.ts";
import type { Module } from "../types";

export default function ModuleDetails() {
  const { code } = useParams<{ code: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState();

  useEffect(() => {
    let active = true;
    (async () => {
      if (!code) {
        setError("No module code in URL.");
        setLoading(false);
        return;
      }
      try {
        const data = await getModuleDetails(code);
        if (active) setModule(data ?? null);
        const revs = await getReviews(data?.moduleId);
        setReviews(revs);
      } catch (e: any) {
        if (active) setError(e?.message ?? "Failed to fetch module.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [code]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (!module) return <p>Module not found.</p>;

  return (
    <div>
      <ModuleDescription module={module} />
      <ReviewList reviews={reviews} />
    </div>
  );
}
