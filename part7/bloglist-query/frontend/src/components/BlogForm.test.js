import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls event handler with correct details for new blog', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('title')
  const author = screen.getByPlaceholderText('author')
  const url = screen.getByPlaceholderText('url')
  const submitButton = screen.getByText('create')

  await user.type(title, 'a blog')
  await user.type(author, 'a blogger')
  await user.type(url, 'http://blog.url.com/')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('a blog')
  expect(createBlog.mock.calls[0][0].author).toBe('a blogger')
  expect(createBlog.mock.calls[0][0].url).toBe('http://blog.url.com/')
})
