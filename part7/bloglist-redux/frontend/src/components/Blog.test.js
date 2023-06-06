import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let mockHandler

  beforeEach(() => {
    const blog = {
      title: 'a blog',
      author: 'a blogger',
      url: 'http://blog.blog.com',
      likes: 42,
      user: {
        name: 'test user',
      },
    }

    mockHandler = jest.fn()

    container = render(<Blog blog={blog} handleLike={mockHandler} />).container
  })

  test('renders title and author, not url or likes by default', () => {
    const url = container.querySelector('.url')
    const likes = container.querySelector('.likes')
    const titleAndAuthor = screen.getByText('a blog a blogger')

    expect(titleAndAuthor).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('renders URL and number of likes after expand button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('http://blog.blog.com')
    const likes = screen.getByText('likes 42')
    const titleAndAuthor = screen.getByText('a blog a blogger')

    expect(titleAndAuthor).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('when like button clicked twice, event handler is called twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
