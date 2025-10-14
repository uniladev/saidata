// src/pages/Home.jsx
import { HeroCarousel, Features, About, News } from "../../components/sections/home";

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
