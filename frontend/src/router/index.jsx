import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import SurveyTest from '../js/components/SurveyTest';
import { Home, Login, NotFound, About } from '../pages';
import FormBuilderPage from '../pages/FormBuilderPage'; // ← Import actual component
import FormTakerPage from '../pages/FormTakerPage'; // ← Import actual component
import DashboardLayout from '../components/layout/AuthenticatedLayout';
import Dashboard from '../pages/authenticated/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'survey-test', element: <SurveyTest /> },
      { path: 'create-form', element: <FormBuilderPage /> }, // ← Sekarang menggunakan komponen actual
      { path: 'form/:formId', element: <FormTakerPage /> }, // ← Sekarang menggunakan komponen actual
      { path: '*', element: <NotFound /> }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  // Authenticated (Dashboard) routes
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
    ]
  },
]);