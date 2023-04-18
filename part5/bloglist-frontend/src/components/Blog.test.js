import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'a blog',
      author: 'a blogger',
      url: 'http://blog.blog.com',
      likes: 42,
      user: {
        name: 'test user'
      }
    }

    container = render(<Blog blog={blog} />).container
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
})
