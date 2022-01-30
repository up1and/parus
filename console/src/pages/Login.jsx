import React from 'react'

import { Flex, Box, Heading, Text } from '@chakra-ui/react'

import LoginForm from '../components/LoginForm'


function LoginPage(props) {

  return (
    <Flex flexDirection='column' width='100wh' height='100vh' 
      justifyContent='center' alignItems='center' className='login-page'>
      <Heading as='h1' size='lg'>Login</Heading>
      <Box minW={{ base: '90%', md: '360px' }}>
        <LoginForm/>
      </Box>
    </Flex>
  )
}


export default LoginPage
