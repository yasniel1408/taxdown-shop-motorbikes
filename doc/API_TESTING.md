# Testing the Shop Motorbikes API

This guide explains how to test the Shop Motorbikes API using the provided HTTP request files.

## Prerequisites

- VS Code with the REST Client extension installed
- The API must be deployed (using `serverless deploy`)
- Your API key (automatically included in the request files)

## Available HTTP Request Files

All HTTP request files are located in the `/http` directory:

### 1. Health Check
```http
[GET] health.http
```
Simple endpoint to check if the API is running.

### 2. Customer Management

#### List All Customers
```http
[GET] shop-motorbikes-customers.http
```
Retrieves all customers, sorted by available credit.

#### Get Customer by ID
```http
[GET] customers-by-id.http
```
Replace `{{userId}}` with an actual customer ID.

#### Create Customer
```http
[POST] create-customer.http
```
Example request body:
```json
{
    "userId": "customer123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "availableCredit": 1000
}
```

#### Update Customer
```http
[PUT] update-customer.http
```
Replace `{{userId}}` and modify the request body as needed:
```json
{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1987654321",
    "availableCredit": 2000
}
```

#### Delete Customer
```http
[DELETE] delete-customer.http
```
Replace `{{userId}}` with the ID of the customer to delete.

#### Add Credit
```http
[POST] add-credit.http
```
Replace `{{userId}}` and specify the amount to add:
```json
{
    "amount": 500
}
```

## How to Use

1. Open any `.http` file in VS Code
2. You'll see a "Send Request" link above each request
3. Click "Send Request" to execute the API call
4. The response will appear in a split window

## Testing Flow Example

Here's a recommended flow for testing the API:

1. Check API health using `[GET] health.http`
2. Create a new customer using `[POST] create-customer.http`
3. Get the created customer using `[GET] customers-by-id.http`
4. Add credit using `[POST] add-credit.http`
5. Update customer details using `[PUT] update-customer.http`
6. List all customers using `[GET] shop-motorbikes-customers.http`
7. Finally, delete the customer using `[DELETE] delete-customer.http`

## Response Codes

- 200: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing API key)
- 404: Not Found
- 500: Internal Server Error

## Notes

- All requests require an API key in the `x-api-key` header (already included)
- The API has rate limiting (100 requests per 15 minutes)
- Responses are in JSON format
