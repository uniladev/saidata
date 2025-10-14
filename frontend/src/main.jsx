import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { Home, Login, NotFound ,About} from "./pages"; // <= dari barrel
import SurveyTest from "./js/components/SurveyTest.jsx"; // import komponen SurveyTest

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path:"about", element: <About /> },
      { path: "survey-test", element: <SurveyTest /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/login",
    element: <Login />, // Login tidak menggunakan App layout (tanpa Navbar)
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
