import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, theme } from '@chakra-ui/react';

import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import PostsPage from './pages/Posts'
import SettingsPage from './pages/Settings';
import NotFoundPage from './pages/NotFound';

import AuthRequired from './components/Auth';


function App() {
  return (
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path='/' index element={<AuthRequired><HomePage/></AuthRequired>} />
            <Route path='login' element={<LoginPage/>} />
            <Route path='posts' element={<AuthRequired><PostsPage/></AuthRequired>} />
            <Route path='settings' element={<AuthRequired><SettingsPage/></AuthRequired>} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
  )
}

export default App
