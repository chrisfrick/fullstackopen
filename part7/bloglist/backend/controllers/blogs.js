const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')

  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes} = request.body
  const user = request.user

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user.id,
  })

  let savedBlog = await blog.save()
  console.log('before populate', savedBlog)
  savedBlog = await savedBlog.populate('user')
  console.log('after popoulate', savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) return response.status(404).json({ error: 'blog does not exist' })
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'user does not have permission to delete this blog'})
  }

  await Blog.findByIdAndRemove(request.params.id)
  user.blogs = user.blogs.filter(id => id.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  console.log(body)
  const blog = {
    user: body.user.id,
    ttle: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, blog, { new: true }).populate('user')
  console.log(updatedBlog)
  response.json(updatedBlog)
  
})

module.exports = blogRouter
