import React from 'react'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Form } from './routes/form';
import { Dashboard } from './routes/dashboard';
import { DashboardForm } from './routes/dashboard/form';
import { DashboardNewForm } from './routes/dashboard/new';
import { About } from './routes/about';
import { Index } from './routes';

const router = createHashRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "about",
    element: <About />
  },
  {
    path: "forms/:id",
    element: <Form />
  },
  {
    path: "dashboard",
    element: <Dashboard />
  },
  {
    path: "dashboard/new",
    element: <DashboardNewForm />
  },
  {
    path: "dashboard/:id",
    element: <DashboardForm />
  },
]);

export const App = () => {
  return (
    <RouterProvider router={router} />
  )
}
