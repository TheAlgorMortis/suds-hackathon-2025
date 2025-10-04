import { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";

interface RaterProps {
  initialRating: Number;
  setFunction: React.Dispatch<React.SetStateAction<string>>;
  editable: boolean;
}

export default function Rater({
  initialRating,
  setFunction,
  editable,
}: RaterProps) {
  const [currentRating, setCurrentRating] = useState(initialRating);

  useEffect(() => {
    setFunction(currentRating);
  }, [currentRating]);

  return (
    <div>
      <div>
        <Star
          base={0}
          currentRating={currentRating}
          setCurrentRating={setCurrentRating}
          editable={editable}
        />
        <Star
          base={2}
          currentRating={currentRating}
          setCurrentRating={setCurrentRating}
          editable={editable}
        />
        <Star
          base={4}
          currentRating={currentRating}
          setCurrentRating={setCurrentRating}
          editable={editable}
        />
        <Star
          base={6}
          currentRating={currentRating}
          setCurrentRating={setCurrentRating}
          editable={editable}
        />
        <Star
          base={8}
          currentRating={currentRating}
          setCurrentRating={setCurrentRating}
          editable={editable}
        />
      </div>
    </div>
  );
}

function Star({ base, currentRating, setCurrentRating, editable }) {
  const [starSetting, setStarSetting] = useState();
  let starSymbol;

  useEffect(() => {
    if (currentRating <= base) {
      setStarSetting("empty");
    } else if (currentRating >= base + 2) {
      setStarSetting("full");
    } else {
      setStarSetting("half");
    }
  }, [currentRating]);

  const setStar = () => {
    if (starSetting === "empty") {
      setCurrentRating(base + 1);
    } else if (starSetting === "half") {
      setCurrentRating(base + 2);
    } else {
      setCurrentRating(base);
    }
  };

  const renderStarSymbol = () => {
    switch (starSetting) {
      case "empty":
        return <FaRegStar />;
      case "half":
        return <FaStarHalfAlt />;
      case "full":
        return <FaStar />;
    }
  };

  if (editable) {
    return <h3 onClick={setStar}>{renderStarSymbol()}</h3>;
  } else {
    return <h3>{renderStarSymbol()}</h3>;
  }
}
