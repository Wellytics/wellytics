import React from 'react'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Form } from './routes/form';
import { Dashboard } from './routes/_';
import { DashboardForm } from './routes/_/forms';
import { DashboardNewForm } from './routes/_/forms/new';
import { DashboardFormResponses } from './routes/_/forms/responses';
import { Index } from './routes';
import { DashboardFormResponse } from './routes/_/forms/responses/response';

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
  {
    path: "_/forms/:id/responses/:responseId",
    element: <DashboardFormResponse />
  },
]);

export const App = () => {
  return (
    <RouterProvider router={router} />
  )
}
