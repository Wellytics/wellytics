import React from 'react'
import {
  useParams,
} from "react-router-dom";

export const Form = () => {
  const { id } = useParams();

  return (
    <div>form {id}</div>
  )
}
