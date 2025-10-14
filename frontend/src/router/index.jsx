import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import SurveyTest from '../js/components/SurveyTest';
import Home from '../pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'survey-test',
        element: <SurveyTest />
      }
    ]
  }
]);