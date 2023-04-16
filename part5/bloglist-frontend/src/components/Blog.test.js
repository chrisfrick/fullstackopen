import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, not url or likes by default', () => {
  const blog = {
    title: 'a blog',
    author: 'a blogger',
    url: 'http://blog.blog.com',
    likes: 42
  }

  const { container } = render(<Blog blog={blog} />)
  const url = container.querySelector('.url')
  const likes = container.querySelector('.likes')
  const titleAndAuthor = screen.getByText('a blog a blogger')

  expect(titleAndAuthor).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})
