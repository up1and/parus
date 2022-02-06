import React from 'react';
import { Flex, Box, Heading } from '@chakra-ui/react';

import Sidebar from '../components/Side';
import { MainSection } from '../components/Layout';


function SettingsPage() {
  return (
    <Flex>
      <Sidebar />
      <MainSection title='Settings'>
      </MainSection>
    </Flex>
  );
}

export default SettingsPage