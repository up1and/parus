import React from 'react'
import { Navigate } from 'react-router-dom'

import LoginForm from '../components/LoginForm'

import useAuth from '../stores/auth'

function LoginPage(props) {
  const { isAuthenticated } = useAuth()
  const referer = location.state?.from?.pathname || '/'

  if (isAuthenticated()) {
    return <Navigate to={referer} />
  }

  return (
    <div className="w-full max-w-sm p-6 m-auto bg-white dark:bg-gray-800 flex flex-col justify-center h-screen">
      <LoginForm />
    </div>
  )
}

export default LoginPage
