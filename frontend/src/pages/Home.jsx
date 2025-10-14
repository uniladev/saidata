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
    </>
  );
}
