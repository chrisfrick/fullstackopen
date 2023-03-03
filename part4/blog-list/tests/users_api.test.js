const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user.js')

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash})
  
    await user.save()
  })

  test('valid new user succeeds', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'flast',
      name: 'First Last',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user creation fails with status code 400 if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'secret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('user creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'New User',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('user creation fails if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'New User',
      username: 'nuser',
      password: 'pw',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})



