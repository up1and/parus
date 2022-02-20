import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Flex, Box, Divider, Button } from '@chakra-ui/react'

import Sidebar from '../components/Side'
import {
  MainContainer,
  ContentFilter,
  ContentList,
  Pagination,
} from '../components/Layout'

import { postService } from '../service'

function PostsPage() {
  const [posts, setPosts] = useState([])
  const [drafts, setDrafts] = useState([])
  const [page, setPage] = useState(1)

  const { isError, error, data } = useQuery(
    ['posts', page],
    () => postService.all(page),
    { keepPreviousData: true }
  )

  const newPostButton = (
    <Link to="/editor/post">
      <Button colorScheme="teal" size="sm">
        New Post
      </Button>
    </Link>
  )

  return (
    <Flex>
      <Sidebar />
      <MainContainer title="Posts" action={newPostButton}>
        <ContentFilter />
        {/* <Divider /> */}
        <ContentList posts={data.data.posts} />
        <Pagination links={data.data.links} />
      </MainContainer>
    </Flex>
  )
}

export default PostsPage
