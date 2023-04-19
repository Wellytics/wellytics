import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Root } from "./routes";
import { Form } from "./routes/forms_id";
import { DashboardRoot } from "./routes/_";
import { DashboardAuth } from "./routes/_/auth";
import { DashboardForm } from "./routes/_/forms_id";
import { DashboardFormEdit } from "./routes/_/forms_edit";
import { DashboardFormQuestion } from "./routes/_/forms_questions_id";
import { DashboardFormResponse } from "./routes/_/forms_responses_id";
import { DashboardQuestion } from "./routes/_/questions_id";
import { DashboardMetrics } from "./routes/_/metrics";
import { DashboardTrackingId } from "./routes/_/tracking_id";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "forms/:formId",
    element: <Form />,
  },
  {
    path: "_",
    element: <DashboardRoot />,
    children: [],
  },
  {
    path: "_/auth",
    element: <DashboardAuth />,
  },
  {
    path: "_/forms/:formId",
    element: <DashboardForm />,
    children: [
      {
        path: "edit",
        element: <DashboardFormEdit />,
      },
      {
        path: "questions/:questionId",
        element: <DashboardFormQuestion />,
      },
      {
        path: "responses/:responseId",
        element: <DashboardFormResponse />,
      },
    ],
  },
  {
    path: "_/questions/:questionId",
    element: <DashboardQuestion />,
  },
  {
    path: "_/metrics",
    element: <DashboardMetrics />,
  },
  {
    path: "_/tracking/:trackingId",
    element: <DashboardTrackingId />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
