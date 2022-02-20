import { React, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Box, Heading, Text, Link } from '@chakra-ui/react'

function NotFoundPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setTimeout(() => {
      navigate('/')
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="80vh"
      justifyContent="center"
      alignItems="center"
    >
      <Box textAlign="center" py={10} px={6}>
        <Heading display="inline-block" as="h2" size="2xl">
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={'gray.500'} mb={6}>
          The page you're looking for does not seem to exist
        </Text>
        <Link color="teal.500" href="/">
          Back Home
        </Link>
      </Box>
    </Flex>
  )
}

export default NotFoundPage
