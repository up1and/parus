import React from 'react';
import { Flex, Box, Heading } from '@chakra-ui/react';


function Header(props) {
  return (
    <></>
  )
};


function MainSection(props) {
  return (
    <Box px={8}>
        <Heading as='h2' size='lg' mt={6}>{props.title}</Heading>
        {props.children}
    </Box>
  )
};


export {
  Header,
  MainSection,
};