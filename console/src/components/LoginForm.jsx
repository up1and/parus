import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import axios from 'axios'

import useAuth from '../stores/auth'

function LoginForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const login = useAuth((state) => state.login)

  const navigate = useNavigate()
  const referer = location.state?.from?.pathname || '/'

  const onSubmit = (data) => {
    axios
      .post('/api/auth/login', data)
      .then((res) => {
        login(res.data)
        navigate(referer, { replace: true })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          for="username"
          className="block text-sm text-gray-800 dark:text-gray-200"
        >
          Username
        </label>
        <input
          type="text"
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          {...register('username', { required: true })}
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label
            for="password"
            className="block text-sm text-gray-800 dark:text-gray-200"
          >
            Password
          </label>
        </div>

        <input
          type="password"
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          {...register('password', { required: true })}
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          disabled={isSubmitting}
        >
          Login
        </button>
      </div>
    </form>
  )
}

export default LoginForm
