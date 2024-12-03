const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true })
  response.json(updatedBlog)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and url are required'})
  }

  const blog = new Blog({ title, author, url, likes })
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter