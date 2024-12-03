const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    { title: 'Blog 1', author: 'Author 1', url: 'http://example1.com', likes: 5 },
    { title: 'Blog 2', author: 'Author 2', url: 'http://example2.com', likes: 10 }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
})

test('identifier is named "id"', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert.ok(blog.id, 'Blog should have an id property')
        assert.strictEqual(typeof blog.id, 'string', 'id should be a string')
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newblog.com',
      likes: 15
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    assert(titles.includes('New Blog'))
})

test('likes default to 0 if missing', async () => {
    const testBlog = {
        title: 'Blog without likes',
        author: 'Anonymous',
        url: 'http://example.com'
    }

    const response = await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        assert.strictEqual(response.body.likes, 0, 'Default value for likes should be 0')
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: 'Test Author',
        url: 'http://test.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('blog without url is not added', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    const ids = blogsAtEnd.body.map(r => r.id)

    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length -1)
    assert(!ids.includes(blogToDelete.id))
})

test('updating likes of a blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
    }

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: updatedBlog.likes })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, updatedBlog.likes)
})
  
after(async () => {
  await mongoose.connection.close()
})