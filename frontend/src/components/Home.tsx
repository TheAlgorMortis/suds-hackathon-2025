import "./Bodies.css";
import { GiSquirrel } from "react-icons/gi";
import { FaBook } from "react-icons/fa";
import { LuNut } from "react-icons/lu";
import { FaGraduationCap } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * This component defines the landing page of the website and provides the user
 * with the vision and functionality of Maroonut.
 */
export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="sectionHeading"> Welcome to Maroonut! </h2>
      <div className="sectionBlock">
        <h3 className="sectionBlockHeading">
          Who We Are <GiSquirrel />
        </h3>
        <p>
          This is a platform designed for users to help each other make informed
          choices for their module selections at Stellenbosch University, share
          advice for modules, as well as connect with students and tutors.
        </p>
        <h3 className="sectionBlockHeading">
          A Modern Replacement for the Stellenbosch Yearbook <FaBook />
        </h3>
        <p>
          Have you ever found yourself struggling to decide what modules to
          take? You may be debating electives, or stuggling to find and cross
          reference requisites.
        </p>
        <p>
          Maroonut aims to take this struggle away by doing all that work for
          you. All you have to do is search for the module you're considering,
          and you'll have everything you ever wanted to know.
        </p>
        <p>
          Beside the module descriptions, requisites are displayed with links to
          the pages of the corresponding modules to make them easy to navigate.
        </p>
        <p>
          To get started, sign in and navigate to the{" "}
          <span className="maroonText" onClick={() => navigate("/modules")}>
            Modules
          </span>{" "}
          page of this website.
        </p>
        <h3 className="sectionBlockHeading">
          The Module Rate and Review System <LuNut />
        </h3>
        <p>Wondering how the modules get their ratings?</p>
        <p>
          On Maroonut, users who have taken modules can post reviews on them,
          including their overall rating of the module. The incentive is that
          users can share their experience beyond what is shared in the module
          framework to help prospective students find out more about what they
          can really expect to gain from the module. Users can complain about
          their lecturers, rave about the practicals, or say whatever they want.
        </p>
        <p>
          To mitigate the detriments of free speech, a voting system allows
          users to give or steal "acorns" to or from that review. Reviews with
          more acorns are higher up on the list, and more credible, as users
          will give acorns to reviews that are more helpful and agreeable,
          forcing the unhelpful reviews to sink to the bottom of the list.
        </p>
        <p>
          As a comparison, this works the same way as Reddit's upvote and
          downvote system.
        </p>
        <h3 className="sectionBlockHeading">
          Finding Tutors <FaGraduationCap />
        </h3>
        <p>
          One of Maroonut's primary goals is to connect students with tutors.
        </p>
        <p>
          On each module's page, users can find tutors, who market themselves
          through Maroonut. Students can enquire these tutors via a button that
          will allow them to email the tutor.
        </p>
        <h3 className="sectionBlockHeading">
          User Profiles <FaUser />
        </h3>
        <p>
          Each review and tutor advert also allows you to visit the reviewer or
          tutor's user profile, which provides information like their academic
          performance, total net acorns received on any reviews, their ratings
          on their modules, and the modules that they tutor for.
        </p>
        <p>
          This allows you to keep up with reviewers and tutors you trust and
          respect.
        </p>
      </div>
      <h2 className="sectionHeading"> About the Developers </h2>
      <div className="sectionBlock">
        <p>
          At the time of writing, Dylan and Dylan are 3rd year students at
          Stellenbosch University. To find out more about us, you can visit our
          personal websites here.
        </p>
        <div className="flexRow">
          <button
            className="outerButton"
            onClick={() =>
              window.open(
                "https://thealgormortis.github.io/personal-website/",
                "_blank",
              )
            }
          >
            Dylan Reid's Website
          </button>
          <button
            className="outerButton"
            onClick={() =>
              window.open("https://straws11.github.io//", "_blank")
            }
          >
            Dylan Swarts' Website
          </button>
        </div>
      </div>
    </div>
  );
}
