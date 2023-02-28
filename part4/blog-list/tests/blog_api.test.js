const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "New Blog",
    author: "Bloggy McBlogface",
    url: "http://blog.blog.blog",
    likes: 42,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  blogsAtEnd.forEach(blog => delete blog.id)
  expect(blogsAtEnd).toContainEqual(newBlog)
})

test('missing likes property defaults to the value 0', async () => {
  const newBlog = {
    title: "New Blog",
    author: "Bloggy McBlogface",
    url: "http://blog.blog.blog",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()
  blogsAtEnd.forEach(blog => delete blog.id)
  const newBlogWithNoLikes = {
    title: "New Blog",
    author: "Bloggy McBlogface",
    url: "http://blog.blog.blog",
    likes: 0,
  }
  expect(blogsAtEnd).toContainEqual(newBlogWithNoLikes)
})

afterAll(async () => {
  await mongoose.connection.close()
})