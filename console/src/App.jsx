import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import PostsPage from './pages/Posts'
import SettingsPage from './pages/Settings'
import NotFoundPage from './pages/NotFound'

import AuthRequired from './components/Auth'

import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            index
            element={
              <AuthRequired>
                <HomePage />
              </AuthRequired>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="posts"
            element={
              <AuthRequired>
                <PostsPage />
              </AuthRequired>
            }
          />
          <Route
            path="settings"
            element={
              <AuthRequired>
                <SettingsPage />
              </AuthRequired>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App
