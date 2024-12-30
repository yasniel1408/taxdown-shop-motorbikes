# Motorbike Shop Customer Management API

A serverless API for managing customers in a motorbike shop, built with AWS Lambda, API Gateway, and DynamoDB. The project follows Hexagonal Architecture and Domain-Driven Design principles.

![Architecture](./doc/serverless-architecture.png)

## Architecture

The project follows a clean architecture approach with three main layers:

- **Domain Layer**: Contains business logic and entities
- **Application Layer**: Contains use cases and ports
- **Infrastructure Layer**: Contains adapters for external services

### Architectural Patterns Used

1. **Hexagonal Architecture (Ports and Adapters)**
   - Clear separation between business logic and external dependencies
   - Business logic is isolated in the domain layer
   - Ports define interfaces for input and output
   - Adapters implement these interfaces for specific technologies

2. **Domain-Driven Design (DDD)**
   - Rich domain models with business logic
   - Value objects for immutable concepts
   - Aggregates for consistency boundaries
   - Repository pattern for persistence

3. **Clean Code Principles**
   - Single Responsibility Principle
   - Dependency Inversion
   - Interface Segregation
   - Clear naming conventions

## Prerequisites

- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI (`npm install -g serverless`)
- Visual Studio Code
    - [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd shop-motorbikes
```

2. Install dependencies:
```bash
npm install
```

3. Deploy to AWS:
```bash
serverless deploy
```

## Local Development

To run the API locally:

```bash
serverless offline
```

The API will be available at `http://localhost:3000`

## API Endpoints

All endpoints require an API key in the `x-api-key` header.


## Testing

The project includes `.http` files in the `/http` directory for testing all endpoints. These can be used with REST Client in VS Code or similar tools.

### Test Files Location
```
/http/
├── [GET] health.http
├── [GET] customers.http
├── [GET] customers-by-id.http
├── [POST] create-customer.http
├── [PUT] update-customer.http
├── [DELETE] delete-customer.http
└── [POST] add-credit.http
```

### Testing Steps

1. Get your API key from the deployment output
2. Update the API key in the `.http` files
3. Run the requests in the following order:
   - Health check (verify API is running)
   - Create customer (add a new customer)
   - Get customer (verify customer was created)
   - Update customer (modify customer details)
   - Add credit (increase customer's credit)
   - List all customers (verify changes)
   - Delete customer (clean up)

## Project Structure

```
src/
├── application/           # Application layer
│   ├── ports/            # Ports (interfaces)
│   │   ├── in/          # Input ports (use cases)
│   │   └── out/         # Output ports (repositories)
│   └── services/        # Application services
├── domain/               # Domain layer
│   ├── entities/        # Domain entities
│   └── value-objects/   # Value objects
└── infrastructure/       # Infrastructure layer
    ├── adapters/        # Adapters
    │   ├── in/         # Input adapters (controllers)
    │   └── out/        # Output adapters (repositories)
    └── config/         # Configuration
```

### Key Components

1. **Domain Layer**
   - `Customer` entity: Core business logic for customers
   - `Credit` value object: Immutable value object for credit amounts

2. **Application Layer**
   - `CustomerUseCases`: Input port defining all use cases
   - `CustomerRepository`: Output port for persistence
   - `CustomerService`: Implementation of use cases

3. **Infrastructure Layer**
   - `CustomerController`: REST API adapter
   - `DynamoDBCustomerRepository`: DynamoDB adapter
   - Express configuration and middleware

## Environment Variables

- `USERS_TABLE`: DynamoDB table name (automatically set during deployment)
- `NODE_ENV`: Environment name ('development' or 'production')

## Security Features

1. **API Gateway Security**
   - API Key authentication required for all endpoints
   - Secure key distribution and management

2. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents abuse and DoS attacks

3. **CORS Configuration**
   - Properly configured CORS headers
   - Secure cross-origin resource sharing

4. **Input Validation**
   - Request payload validation
   - Type checking and sanitization
   - Error handling for invalid inputs

5. **Error Handling**
   - Consistent error response format
   - Production-safe error messages
   - Detailed logging for debugging

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

## License

MIT

## Support

For support, please open an issue in the repository or contact the development team.