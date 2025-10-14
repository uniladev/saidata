// src/pages/Home.jsx
import { HeroCarousel, Features, About, News } from "../components/sections";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Features />
      <About />
      <News />
      <div className="flex justify-center my-8">
        <Link
          to="/survey-test"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Test SurveyJS
        </Link>
      </div>
    </>
  );
}
