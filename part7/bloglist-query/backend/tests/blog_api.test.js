const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const userExtractor = require('../utils/middleware').userExtractor

const User = require('../models/user.js')
const Blog = require('../models/blog')

let token = ''

beforeAll(async () => {
  await User.deleteMany({})

  const newUser = {
    name: 'Superuser',
    username: 'root',
    password: 'secret',
  }

  await api.post('/api/users').send(newUser)

  const response = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })

  token = response.body.token

  console.log(token)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when blogs are initially in the database', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property is named "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding a blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Bloggy McBlogface',
      url: 'http://blog.blog.blog',
      likes: 42,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    blogsAtEnd.forEach((blog) => {
      delete blog.id
      delete blog.user
    })
    expect(blogsAtEnd).toContainEqual(newBlog)
  })

  test('succeeds with missing likes property, which defaults to 0', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Bloggy McBlogface',
      url: 'http://blog.blog.blog',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    blogsAtEnd.forEach((blog) => {
      delete blog.id
      delete blog.user
    })
    const newBlogWithNoLikes = {
      title: 'New Blog',
      author: 'Bloggy McBlogface',
      url: 'http://blog.blog.blog',
      likes: 0,
    }
    expect(blogsAtEnd).toContainEqual(newBlogWithNoLikes)
  })

  test('fails with status code 400 for a missing title', async () => {
    const newBlog = {
      author: 'Bloggy McBlogface',
      url: 'http://blog.blog.blog',
      likes: 42,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 400 for a missing url', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Bloggy McBlogface',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb
    const newBlog = {
      title: 'New Blog',
      author: 'Bloggy McBlogface',
      url: 'http://blog.blog.blog',
      likes: 42,
    }

    await api.post('/api/blogs').send(newBlog).expect(401)

    const blogsAtEnd = await helper.blogsInDb
    expect(blogsAtEnd.length).toEqual(blogsAtStart.length)
  })
})

describe('deleting a blog post', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const newBlog = {
      title: 'New Blog',
      author: 'Bloggy McBlogface',
      url: 'http://blog.blog.blog',
      likes: 42,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete).toHaveLength(blogsAtStart.length - 1)

    expect(blogsAfterDelete).not.toContainEqual(blogsAtStart[0])
  })
})

describe('updating an individual blog post', () => {
  test('succeeds when updating likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = { ...blogsAtStart[0] }
    blogToUpdate.likes += 10
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAfterUpdate = await helper.blogsInDb()
    expect(blogsAfterUpdate[0].likes).toEqual(blogsAtStart[0].likes + 10)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
