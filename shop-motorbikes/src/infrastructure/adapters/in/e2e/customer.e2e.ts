import { SuperTest, Test } from 'supertest';
import { setupTestApp, TEST_API_KEY, testCustomer } from './helpers/setup';

describe('Customer API (e2e)', () => {
    let request: SuperTest<Test>;
    let createdCustomerId: string;

    beforeEach(() => {
        request = setupTestApp() as unknown as SuperTest<Test>;
    });

    describe('Health Check', () => {
        it('GET /health - should return health status', async () => {
            const response = await request
                .get('/api/health')
                .set('x-api-key', TEST_API_KEY);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: 'healthy', timestamp: expect.any(String) });
        });
    });

    describe('Customer CRUD Operations', () => {
        it('POST /customers - should create a new customer', async () => {
            const response = await request
                .post('/api/customers')
                .set('x-api-key', TEST_API_KEY)
                .send(testCustomer);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('userId');
            expect(response.body.name).toBe(testCustomer.name);
            expect(response.body.email).toBe(testCustomer.email);
            expect(response.body.phone).toBe(testCustomer.phone);
            expect(response.body.availableCredit).toBe(testCustomer.availableCredit);

            createdCustomerId = response.body.userId;
        });

        it('GET /customers - should return all customers', async () => {
            const response = await request
                .get('/api/customers')
                .set('x-api-key', TEST_API_KEY);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.some((customer: any) => customer.userId === createdCustomerId)).toBe(true);
        });

        it('GET /customers/:userId - should return a specific customer', async () => {
            const response = await request
                .get(`/api/customers/${createdCustomerId}`)
                .set('x-api-key', TEST_API_KEY);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('userId', createdCustomerId);
            expect(response.body.name).toBe(testCustomer.name);
        });

        it('PUT /customers/:userId - should update a customer', async () => {
            const updatedCustomer = {
                ...testCustomer,
                name: 'John Updated',
                email: 'john.updated@example.com'
            };

            const response = await request
                .put(`/api/customers/${createdCustomerId}`)
                .set('x-api-key', TEST_API_KEY)
                .send(updatedCustomer);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe(updatedCustomer.name);
            expect(response.body.email).toBe(updatedCustomer.email);
        });

        it('POST /customers/:userId/credit - should add credit to customer', async () => {
            const creditAmount = 500;
            const response = await request
                .post(`/api/customers/${createdCustomerId}/credit`)
                .set('x-api-key', TEST_API_KEY)
                .send({ amount: creditAmount });

            expect(response.status).toBe(200);
            expect(response.body.availableCredit).toBe(testCustomer.availableCredit + creditAmount);
        });

        it('DELETE /customers/:userId - should delete a customer', async () => {
            const deleteResponse = await request
                .delete(`/api/customers/${createdCustomerId}`)
                .set('x-api-key', TEST_API_KEY);

            expect(deleteResponse.status).toBe(204);

            // Verify customer is deleted
            const getResponse = await request
                .get(`/api/customers/${createdCustomerId}`)
                .set('x-api-key', TEST_API_KEY);

            expect(getResponse.status).toBe(404);
        });
    });

    describe('Error Handling', () => {
        it('GET /customers/invalid-id - should return 404 for non-existent customer', async () => {
            const response = await request
                .get('/api/customers/non-existent-id')
                .set('x-api-key', TEST_API_KEY);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: 'CustomerNotFoundError',
                message: 'Customer not found'
            });
        });

        it('POST /customers - should return 400 for invalid customer data', async () => {
            const invalidCustomer = {
                name: 'Invalid Customer'
                // Missing required fields
            };

            const response = await request
                .post('/api/customers')
                .set('x-api-key', TEST_API_KEY)
                .send(invalidCustomer);

            expect(response.status).toBe(400);
        });

        it('POST /customers/:userId/credit - should return 400 for invalid credit amount', async () => {
            const response = await request
                .post(`/api/customers/${createdCustomerId}/credit`)
                .set('x-api-key', TEST_API_KEY)
                .send({ amount: -100 }); // Negative amount should be invalid

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'CreditNotNegativeError',
                message: 'Credit amount cannot be negative'
            });
        });
    });
});
