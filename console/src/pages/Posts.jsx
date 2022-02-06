import React from 'react';
import { Flex, Box, Heading } from '@chakra-ui/react';

import Sidebar from '../components/Side';
import { MainSection } from '../components/Layout';


function PostsPage() {
  return (
    <Flex>
      <Sidebar />
      <MainSection title='Posts'>
      </MainSection>
    </Flex>
  );
}

export default PostsPage