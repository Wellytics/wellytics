import React from 'react'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Form } from './routes/form';
import { Dashboard } from './routes/_';
import { DashboardForm } from './routes/_/form';
import { DashboardNewForm } from './routes/_/new';
import { DashboardFormResponses } from './routes/_/responses';
import { Index } from './routes';

const router = createHashRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "forms/:id",
    element: <Form />
  },
  {
    path: "_",
    element: <Dashboard />
  },
  {
    path: "_/forms/new",
    element: <DashboardNewForm />
  },
  {
    path: "_/forms/:id",
    element: <DashboardForm />
  },
  {
    path: "_/forms/:id/responses",
    element: <DashboardFormResponses />
  },
]);

export const App = () => {
  return (
    <RouterProvider router={router} />
  )
}
