import { useNavigate } from "react-router-dom";
import type { ModulePreview } from "../types";
import { getPreviews } from "../api/moduleApi";
import { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import Rater from "./Rater";

interface ModulesProps {
  username: string;
}

/**
 * Display a list of clickable module previews
 * The user can search through the module previews using a search bar that
 * considers both the module code and the module name.
 *
 * Each module preview
 */
export default function ModuleList({ username }: ModulesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [modulePreviews, setModulePreviews] = useState<ModulePreview[]>([]);
  // This isn't currently used right now, but is intended to be used in future
  // versions for polish
  const [loading, setLoading] = useState(true);

  // Load module previews
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPreviews();
        if (!cancelled) {
          setModulePreviews(data);
          setSelectedIndices(data.map((_, i) => i));
        }
      } catch (e) {
        console.error("Failed to load previews:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle Searches
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();

    const next =
      q === ""
        ? modulePreviews.map((_, i) => i)
        : modulePreviews.reduce<number[]>((acc, m, i) => {
            const title = (
              (m.code ?? "") +
              ": " +
              (m.name ?? "")
            ).toLowerCase();
            if (title.includes(q)) acc.push(i);
            return acc;
          }, []);

    setSelectedIndices(next);
  }, [searchTerm, modulePreviews]);

  // Map out the module previews to be displayed
  const visiblePreviews = useMemo(
    () =>
      selectedIndices
        .map((i) => modulePreviews[i])
        .filter((m): m is ModulePreview => Boolean(m)),
    [selectedIndices, modulePreviews],
  );

  return (
    <div>
      <h2 className="sectionHeading">Modules</h2>
      <ModuleSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {visiblePreviews.length === 0 ? (
        <h2 className="sectionSubHeading"> No modules </h2>
      ) : (
        visiblePreviews.map((m) => (
          <ModulePreviewBlock
            key={m.code ?? m.name}
            preview={m}
            searchTerm={searchTerm}
            username={username}
          />
        ))
      )}
    </div>
  );
}

/******************************
 * Module searching
 *******************************/

interface ModuleSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

/*
 * React component used to search for Modules
 */
function ModuleSearch({ searchTerm, setSearchTerm }: ModuleSearchProps) {
  return (
    <div className="searchBarGroup">
      <h3 className="sectionSubHeading">
        <FaSearch />
        Search:
      </h3>
      <input
        className="searchBar"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

/******************************
 * Individual module previews
 *******************************/

interface ModulePreviewProps {
  preview: ModulePreview;
  searchTerm: string;
}

/**
 * Component to preview a Module to be selected to view
 */
function ModulePreviewBlock({ preview, searchTerm }: ModulePreviewProps) {
  const navigate = useNavigate();
  const title: string = preview.code + ": " + preview.name;
  const titleSplit = splitBySubstring(title, searchTerm);

  /* Navigate to individual modules */
  const selectModule = (code: string) => {
    navigate(`/modules/${code}`, { replace: true });
  };

  return (
    <div className="sectionBlock">
      <h2 className="sectionBlockHeading">
        {titleSplit.preTotal}
        <span className="searchHighlight">{titleSplit.totalSub}</span>
        {titleSplit.postTotal}
      </h2>
      <div className=".ratingGroup">
        <h2 className="borderlessHeading">
          Average Rating:
          <Rater
            initialRating={preview.rating}
            setFunction={() => {}}
            editable={false}
          />
        </h2>
      </div>
      <button
        className="outerButton"
        onClick={() => selectModule(preview.code)}
      >
        <h2>Find out more</h2>
      </button>
    </div>
  );
}

/**
 * Splits a string by a substring so that the substring can be highlighted
 */
function splitBySubstring(total: string, totalSubstring: string) {
  if (totalSubstring === "") {
    return { preTotal: "", totalSub: "", postTotal: total };
  }

  const hay = total.toLowerCase();
  const needle = totalSubstring.toLowerCase();

  const i = hay.indexOf(needle);
  if (i === -1) return { preTotal: total, totalSub: "", postTotal: "" };

  const j = i + needle.length;
  return {
    preTotal: total.slice(0, i),
    totalSub: total.slice(i, j),
    postTotal: total.slice(j),
  };
}
