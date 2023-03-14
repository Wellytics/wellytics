import React from 'react'
import { useTitle } from '../hooks/useTitle'

export const Index = () => {
  const [title, setTitle] = useTitle("Brothers on The Rise")

  return (
    <div>index</div>
  )
}
