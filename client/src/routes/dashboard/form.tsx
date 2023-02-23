import React from 'react'
import {
  useParams,
} from "react-router-dom";

export const DashboardForm = () => {
  const { id } = useParams();

  return (
    <div>form {id}</div>
  )
}
