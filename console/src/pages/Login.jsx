import React from 'react';
import { Navigate } from 'react-router-dom';

import { Flex, Box, Heading } from '@chakra-ui/react';

import LoginForm from '../components/LoginForm';

import useAuth from '../stores/auth';


function LoginPage(props) {
  const { isAuthenticated } = useAuth();
  const referer = location.state?.from?.pathname || '/';

  if (isAuthenticated()) {
    return <Navigate to={referer} />
  }

  return (
    <Flex flexDirection='column' width='100wh' height='80vh' 
      justifyContent='center' alignItems='center' className='login-page'>
      <Heading as='h1' size='lg'>Login</Heading>
      <Box minW={{ base: '90%', md: '360px' }}>
        <LoginForm/>
      </Box>
    </Flex>
  )
}


export default LoginPage
