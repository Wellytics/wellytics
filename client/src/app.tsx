import React from 'react'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Root } from './routes';
import { Form } from './routes/forms_id';
import { DashboardRoot } from './routes/_';
import { DashboardAuth } from './routes/_/auth';
import { DashboardForms } from './routes/_/forms';
import { DashboardForm } from './routes/_/forms_id';
import { DashboardFormEdit } from './routes/_/forms_edit';
import { DashboardFormQuestion } from './routes/_/forms_questions_id';
import { DashboardFormResponse } from './routes/_/forms_responses_id';
import { DashboardQuestion } from './routes/_/questions_id';
import { DashboardQuestions } from './routes/_/questions';
import { DashboardQuestionEdit } from './routes/_/questions_edit';
import { DashboardMetrics } from './routes/_/metrics';
import { DashboardMetric } from './routes/_/metrics_id';
import { DashboardMetricEdit } from './routes/_/metrics_edit';
import { DashboardTracking } from './routes/_/tracking';
import { DashboardTrackingId } from './routes/_/tracking_id';

const router = createHashRouter([
  {
    path: "/",
    element: <Root />
  },
  {
    path: "forms/:formId",
    element: <Form />
  },
  {
    path: "_",
    element: <DashboardRoot />,
    children: [
    ]
  },
  {
    path: "_/auth",
    element: <DashboardAuth />
  },
  {
    path: "_/forms",
    element: <DashboardForms />
  },
  {
    path: "_/forms/:formId",
    element: <DashboardForm />,
    children: [
      {
        path: "edit",
        element: <DashboardFormEdit />
      },
      {
        path: "questions/:questionId",
        element: <DashboardFormQuestion />
      },
      {
        path: "responses/:responseId",
        element: <DashboardFormResponse />
      },
    ]
  },
  {
    path: "_/questions",
    element: <DashboardQuestions />
  },
  {
    path: "_/questions/:questionId",
    element: <DashboardQuestion />,
    children: [
      {
        path: "edit",
        element: <DashboardQuestionEdit />
      }
    ]
  },
  {
    path: "_/metrics",
    element: <DashboardMetrics />
  },
  {
    path: "_/metrics/:metricId",
    element: <DashboardMetric />,
    children: [
      {
        path: "edit",
        element: <DashboardMetricEdit />
      }
    ]
  },
  {
    path: "_/tracking",
    element: <DashboardTracking />
  },
  {
    path: "_/tracking/:trackingId",
    element: <DashboardTrackingId />
  }
]);

export const App = () => {
  return (
    <RouterProvider router={router} />
  )
}
