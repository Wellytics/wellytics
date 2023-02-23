import React from 'react'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Form } from './routes/form';
import { Dashboard } from './routes/dashboard';
import { DashboardEditForm } from './routes/dashboard/edit';
import { DashboardNewForm } from './routes/dashboard/new';
import { DashboardViewForm } from './routes/dashboard/view';

const router = createHashRouter([
  {
    path: "forms/:id",
    element: <Form />
  },
  {
    path: "dashboard",
    element: <Dashboard />
  },
  {
    path: "dashboard/forms/new",
    element: <DashboardNewForm />
  },
  {
    path: "dashboard/forms/view/:id",
    element: <DashboardViewForm />
  },
  {
    path: "dashboard/forms/:id",
    element: <DashboardEditForm />
  },
]);

export const App = () => {
  return (
    <RouterProvider router={router} />
  )
}
