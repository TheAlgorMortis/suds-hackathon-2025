import { useNavigate } from "react-router-dom";
import type { ModulePreview } from "../types.ts";
import { getPreviews } from "../api/moduleApi.tsx";

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
  const [selectedIndices, setSelectedIndices] = useState([]);

  //list by their title and uses only selected indices
  let modulePreviews = getPreviews();

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();

    const next =
      q === ""
        ? modulePreviews.map((_, i) => i)
        : modulePreviews.reduce<number[]>((acc, m, i) => {
            const title = (
              (m.code ?? "") +
              ": " +
              (m.title ?? "")
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
  let title = preview.code + " : " + preview.title;
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
      <button className="sectionButtonLeft" onClick={() => selectModule(code)}>
        <h2>Find out more</h2>
      </button>
      <h2> rating: {preview.rating} </h2>
    </div>
  );
}
