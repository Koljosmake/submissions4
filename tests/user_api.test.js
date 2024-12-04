const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

test('creation fails if username is already taken', async () => {
  const newUser = { username: 'testuser', name: 'Test User', password: 'password123' }

  await api.post('/api/users').send(newUser).expect(201)

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.ok(result.body.error.includes('Username must be unique'))
})

test('creation fails if username or password is less than 3 characters', async () => {
  const invalidUser = { username: 'te', name: 'Test User', password: '12' }

  const result = await api
    .post('/api/users')
    .send(invalidUser)
    .expect(400)

  assert.ok(result.body.error.includes('must be at least 3 characters long'))
})

after(async () => {
  await mongoose.connection.close()
})
