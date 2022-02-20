import React from 'react'
import {
  IconButton,
  Box,
  Divider,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  useColorMode,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Center,
} from '@chakra-ui/react'
import {
  FiHome,
  FiEdit,
  FiFile,
  FiTag,
  FiSettings,
  FiMenu,
  FiChevronDown,
  FiMoon,
  FiSun,
} from 'react-icons/fi'

import { Link } from 'react-router-dom'

import useAuth from '../stores/auth'

const LinkItems = [
  { name: 'Home', icon: FiHome, path: '/' },
  { name: 'Posts', icon: FiEdit, path: '/posts' },
  { name: 'Pages', icon: FiFile, path: '/pages' },
  { name: 'Metas', icon: FiTag, path: '/metas' },
]

const Nav = ({ onClose, ...rest }) => {
  return (
    <Flex direction={'column'} grow={1} {...rest}>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Flex>
  )
}

const NavItem = ({ path, icon, children, ...rest }) => {
  return (
    <Link to={path}>
      <Flex
        align="center"
        py="2"
        px="8"
        role="group"
        cursor="pointer"
        color="gray.600"
        _hover={{
          bg: useColorModeValue('gray.50', 'gray.700'),
          color: 'black',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="3"
            fontSize="14"
            _groupHover={{
              color: 'black',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

const NavHeader = () => {
  const { logout } = useAuth()
  return (
    <Flex p="4">
      <Menu>
        <MenuButton
          py={2}
          transition="all 0.3s"
          _focus={{ boxShadow: 'none' }}
          cursor={'pointer'}
        >
          <HStack alignItems="center">
            <Avatar size="md" />
            <VStack
              display={{ base: 'none', md: 'flex' }}
              alignItems="flex-start"
              spacing="1px"
              w="150px"
              pl="2"
            >
              <Text fontSize="sm" fontWeight="bold">
                Leaves
              </Text>
              <Text fontSize="xs" color="gray.600">
                Admin
              </Text>
            </VStack>
            <FiChevronDown />
          </HStack>
        </MenuButton>
        <MenuList alignItems={'center'}>
          <Center>
            <Avatar size={'xl'} />
          </Center>
          <Center>
            <p>Username</p>
          </Center>
          <MenuDivider />
          <MenuItem>
            <Link to="/profile">Profile</Link>
          </MenuItem>
          <MenuItem onClick={logout}>
            <Link to="/">Logout</Link>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

const NavBottom = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex p="7" justifyContent="space-between">
      <Link to="/settings">
        <IconButton isRound icon={<FiSettings />}></IconButton>
      </Link>
      <IconButton
        isRound
        onClick={toggleColorMode}
        icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
      ></IconButton>
    </Flex>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Leaves
      </Text>
    </Flex>
  )
}

function Sidebar() {
  return (
    <Flex
      minH="100vh"
      w={260}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      direction={'column'}
      className="aside"
    >
      <NavHeader />
      <Nav />
      <NavBottom />
    </Flex>
  )
}

export default Sidebar
