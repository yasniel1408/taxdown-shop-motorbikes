# Motorbike Shop Customer Management API

A serverless REST API for managing customers in an online motorbike shop. Built with Node.js, Express, and AWS DynamoDB.

## Features

- Full CRUD operations for customer management
- Credit management system
- List customers sorted by available credit
- Serverless deployment to AWS
- DynamoDB for data persistence
- Input validation
- Error handling

## Prerequisites

- Node.js 20.x or later
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI installed (`npm install -g serverless`)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Local Development

To run the API locally:

```bash
serverless offline
```

The API will be available at `http://localhost:3000`

## Deployment

To deploy to AWS:

```bash
serverless deploy
```

## API Endpoints

### Customers

#### Create Customer
- **POST** `/customers`
```json
{
  "userId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "availableCredit": number
}
```

#### Get Customer
- **GET** `/customers/:userId`

#### Update Customer
- **PUT** `/customers/:userId`
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "availableCredit": number
}
```

#### Delete Customer
- **DELETE** `/customers/:userId`

#### Add Credit
- **POST** `/customers/:userId/credit`
```json
{
  "amount": number
}
```

#### List Customers (Sorted by Credit)
- **GET** `/customers`

## Architecture

The application follows a serverless architecture using AWS Lambda and API Gateway:

- **API Gateway**: Handles HTTP requests
- **Lambda**: Processes requests using Express.js
- **DynamoDB**: Stores customer data with GSI for credit sorting

## Testing

To run tests:

```bash
npm test
```

## Design Decisions

1. **Serverless Architecture**: Chosen for scalability and cost-effectiveness
2. **DynamoDB**: 
   - Used for its scalability and serverless-friendly nature
   - GSI on availableCredit for efficient sorting
3. **Express.js**: Familiar API structure and middleware support
4. **Input Validation**: Comprehensive validation for all endpoints
5. **Error Handling**: Structured error responses for better client experience
