import { Link } from 'react-router-dom'
import {
  Flex,
  Box,
  Heading,
  Spacer,
  Container,
  VStack,
  HStack,
  Button,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Text,
  Tag,
} from '@chakra-ui/react'
import { FiChevronDown } from 'react-icons/fi'
import dayjs from 'dayjs'

function ContentFilter(props) {
  return (
    <HStack justify="flex-end" py={2}>
      <Menu>
        <MenuButton as={Button} size="xs" rightIcon={<FiChevronDown />}>
          All Posts
        </MenuButton>
        <MenuList>
          <MenuItem>Draft Posts</MenuItem>
          <MenuItem>Published Posts</MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton as={Button} size="xs" rightIcon={<FiChevronDown />}>
          All Metas
        </MenuButton>
        <MenuList>
          <MenuItem>Sample</MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton as={Button} size="xs" rightIcon={<FiChevronDown />}>
          Sort by
        </MenuButton>
        <MenuList>
          <MenuItem>Newest</MenuItem>
          <MenuItem>Oldest</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  )
}

function ContentList(props) {
  return (
    <VStack align="stretch">
      {props.posts?.map((post) => {
        return (
          <Link to={`/editor/post/${post.id}`}>
            <HStack
              borderBottom="1px"
              borderColor="gray.200"
              py={3}
              _hover={{
                bg: 'gray.50',
              }}
            >
              <VStack flexGrow="1">
                <Heading as="h3" size="md">
                  {post.title}
                </Heading>
                <Text color="gray.400" fontSize="sm">
                  By{' '}
                  <Link to={post.author.username}>{post.author.nickname}</Link>{' '}
                  in{' '}
                  {post.metas.map((meta) => (
                    <Link to={meta.slug} key={meta.slug}>
                      {meta.name}
                    </Link>
                  ))}{' '}
                  {/* • {strftime('%b %e, %Y', new Date(post.created))} */}•{' '}
                  {dayjs(post.created).format('MMM D, YYYY')}
                </Text>
              </VStack>
              <Box px="2">
                <Tag>Published</Tag>
              </Box>
            </HStack>
          </Link>
        )
      })}
    </VStack>
  )
}

function Pagination(props) {
  return (
    <HStack align="center" justify="center" mt={6}>
      <Button size="sm" variant="outline">
        {' '}
        Prev{' '}
      </Button>
      <Button size="sm" variant="outline">
        {' '}
        Next{' '}
      </Button>
    </HStack>
  )
}

function MainContainer(props) {
  return (
    <Container maxW="container.xl">
      <Flex my={6}>
        <Box>
          <Heading as="h2" size="lg">
            {props.title}
          </Heading>
        </Box>
        <Spacer />
        <Box pt={1}>{props.action}</Box>
      </Flex>
      {props.children}
    </Container>
  )
}

export { MainContainer, ContentFilter, ContentList, Pagination }
