import { useNavigate } from "react-router-dom";
import type { ModulePreview } from "../types";
import { getPreviews } from "../api/moduleApi";
import { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";

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
  const [loading, setLoading] = useState(true);

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
        <p>No modules match.</p>
      ) : (
        visiblePreviews.map((m) => (
          <ModulePreviewBlock
            key={m.code ?? m.title}
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
      <h3>Search Module Codes / Names</h3>
      <FaSearch />
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
  let title = preview.code + ": " + preview.name;
  const titleSplit = splitBySubstring(title, searchTerm);

  /* Navigate to individual modules */
  const selectModule = (code) => {
    navigate(`/modules/${code}`, { replace: true });
  };

  return (
    <div className="sectionBlock">
      <h2>
        {titleSplit.preTotal}
        <span className="searchHighlight">{titleSplit.totalSub}</span>
        {titleSplit.postTotal}
      </h2>
      <button
        className="outerButton"
        onClick={() => selectModule(preview.code)}
      >
        <h2>Find out more</h2>
      </button>
      <h2> rating: {preview.rating} </h2>
    </div>
  );
}

/**
 * Splits a string by a substring so that the substring can be highlighted
 *
 * @param {String} total - the full string
 * @param {String} totalSubstring - the substring to search by in total.
 *
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
