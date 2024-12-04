const express = require('express')
const jwt = require('jsonwebtoken')
const blogsRouter = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const user = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true })
  response.json(updatedBlog)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and url are required'})
  }

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'User authentication failed' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'User authentication failed' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'Permission denied' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter