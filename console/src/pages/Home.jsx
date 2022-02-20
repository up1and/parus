import React from 'react'
import { Flex, Box, Heading } from '@chakra-ui/react'

import Sidebar from '../components/Side'
import { MainContainer } from '../components/Layout'

function HomePage() {
  return (
    <Flex>
      <Sidebar />
      <MainContainer title="Home"></MainContainer>
    </Flex>
  )
}

export default HomePage
