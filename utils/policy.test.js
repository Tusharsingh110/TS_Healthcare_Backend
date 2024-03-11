const request = require('supertest');
const app = require('../index.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');


describe('Policy Creation API Route', () => {
  let adminToken; // Declare admin token variable outside the test scope
  let userToken; // Declare admin token variable outside the test scope

  beforeAll(async () => {
    // Log in admin user to get the token
    const resAdmin = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@tshealthcare.com',
        password: 'Admin11@' // Admin password
      });

    adminToken = resAdmin.body.token; // Assign the admin token from the response
    // console.log('the admin token is' + adminToken)

    // Log in  user to get the token
    const resUser = await request(app)
      .post('/api/users/login')
      .send({
        email: 'tushar@lumiq.ai',
        password: 'Tush2201@#' 
      });

    userToken = resUser.body.token; // Assign the admin token from the response
  });
  it('should allow admin to create a policy', async () => {
    // Mock policy data
    const policyData = {
      policyName: 'Admin creates policy',
      totalAmount: 50000,
      premiumAmount: 3000,
      duration: 1
    };

    // Send POST request to create policy endpoint with admin token
    const res = await request(app)
      .post('/api/policies/createPolicy')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(policyData);

    // Assertions
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.policyName).toEqual(policyData.policyName);
    // Add more assertions as needed
  });

  it('should not allow non-admin user to create a policy', async () => {
    // Mock policy data
    const policyData = {
      policyName: 'User Creates Policy',
      totalAmount: 50000,
      premiumAmount: 3000,
      duration: 1
    };

    // Send POST request to create policy endpoint with non-admin token
    const res = await request(app)
      .post('/api/policies/createPolicy')
      .set('Authorization', `Bearer ${userToken}`) // Use admin token instead of user token
      .send(policyData);

    // Assertions
    expect(res.statusCode).toEqual(403); // Forbidden for non-admin
    // Add more assertions as needed
  });
});