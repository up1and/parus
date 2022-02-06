import React from 'react';
import { Flex, Box, Heading } from '@chakra-ui/react';

import Sidebar from '../components/Side';
import { MainSection } from '../components/Layout';


function HomePage() {
    return (
      <Flex>
        <Sidebar />
        <MainSection title='Home'>
        </MainSection>
      </Flex>
    );
  }

export default HomePage
