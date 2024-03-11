const request = require('supertest');
const app = require('../index.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

describe('Login API Route', () => {
  // Mock user data for testing
  const mockUser = {
    _id: 'mockUserId',
    email: 'test@example.com',
    password: '$2b$10$gdMoWBK3jBd8z.H5aVm6IOKwVIVt7oEklzhaC0Cg/BCD77Ks9PrbO', // Encrypted password for 'Test1234'
    isAdmin: false
  };

  // Mock User.findOne method to return the mock user
  User.findOne = jest.fn().mockReturnValue(mockUser);

  // Mock bcrypt.compare method to return true for any password
  bcrypt.compare = jest.fn().mockResolvedValue(true);

  // Mock jwt.sign method to return a dummy token
  jwt.sign = jest.fn().mockReturnValue('dummyToken');

  let adminToken; // Declare admin token variable outside the test scope

  it('should log in an existing user and return JWT token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'tushar@lumiq.ai',
        password: 'Tush2201@#' // Plain password for testing
      });

    adminToken = res.body.token; // Assign the admin token from the response

    expect(res.statusCode).toEqual(200);  
    expect(res.body).toHaveProperty('token', 'dummyToken');
    expect(res.body).toHaveProperty('userId', 'mockUserId');
    expect(res.body).toHaveProperty('isAdmin', false);
  });

  it('should return error for invalid credentials', async () => {
    // Mock User.findOne to return null (user not found)
    User.findOne = jest.fn().mockReturnValue(null);

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'invalid@example.com',
        password: 'InvalidPassword'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });

  it('should return error for incorrect password', async () => {
    // Mock bcrypt.compare to return false (password does not match)
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'IncorrectPassword'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });
});
