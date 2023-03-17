import { Button, Input } from 'antd'
import React, { useCallback, useState } from 'react'

export const DashboardAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onClickLogin = useCallback(() => { }, [email, password])

  return (
    <div>
      <Input
        placeholder="Email"
        type='email'
        onChange={e => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type='password'
        onChange={e => setPassword(e.target.value)}
      />

      <Button onClick={onClickLogin}>Login</Button>
    </div>
  )
}
