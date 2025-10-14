// src/pages/Home.jsx
import { HeroCarousel, Features, About, News } from "../components/sections";

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
