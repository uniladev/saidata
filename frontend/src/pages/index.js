import { lazy } from "react";
export const Home = lazy(() => import("./guest/Home.jsx"));
export const Login = lazy(() => import("./auth/Login.jsx"));
export const NotFound = lazy(() => import("./guest/NotFound.jsx"));
export const About = lazy(() => import("./guest/About.jsx"));

