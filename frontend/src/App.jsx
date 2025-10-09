import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { Navbar, Footer } from "./components/layout";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}
