import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import express, { Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { Customer, CustomerInput, CreditInput } from './types';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Key validation middleware
const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    res.status(401).json({ error: 'API Key is required' });
    return;
  }
  next();
};

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(validateApiKey);

const USERS_TABLE = process.env.USERS_TABLE as string;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Validate customer data
const validateCustomer = (data: CustomerInput): string[] => {
  const errors: string[] = [];
  if (!data.userId || typeof data.userId !== "string") {
    errors.push('"userId" must be a string');
  }
  if (!data.name || typeof data.name !== "string") {
    errors.push('"name" must be a string');
  }
  if (!data.email || typeof data.email !== "string") {
    errors.push('"email" must be a string');
  }
  if (data.phone && typeof data.phone !== "string") {
    errors.push('"phone" must be a string');
  }
  if (data.availableCredit && typeof data.availableCredit !== "number") {
    errors.push('"availableCredit" must be a number');
  }
  return errors;
};

// API Health Check
app.get("/api/health", (req: Request, res: Response): void => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Get customer by ID
app.get("/api/customers/:userId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    if (Item) {
      res.json(Item as Customer);
    } else {
      res.status(404).json({ error: 'Could not find customer with provided "userId"' });
    }
  } catch (error) {
    next(error);
  }
});

// Create customer
app.post("/api/customers", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const customer: Customer = {
    userId: req.body.userId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    availableCredit: req.body.availableCredit || 0,
    createdAt: new Date().toISOString(),
  };

  const errors = validateCustomer(customer);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const params = {
    TableName: USERS_TABLE,
    Item: customer,
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

// Update customer
app.put("/api/customers/:userId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const customer: CustomerInput = {
    userId: req.params.userId,
    ...req.body,
  };

  const errors = validateCustomer(customer);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: customer.userId,
    },
    UpdateExpression: "set #name = :name, email = :email, phone = :phone, availableCredit = :availableCredit",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": customer.name,
      ":email": customer.email,
      ":phone": customer.phone,
      ":availableCredit": customer.availableCredit,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const command = new UpdateCommand(params);
    const response = await docClient.send(command);
    res.json(response.Attributes as Customer);
  } catch (error) {
    next(error);
  }
});

// Delete customer
app.delete("/api/customers/:userId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const command = new DeleteCommand(params);
    await docClient.send(command);
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Add credit to customer
app.post("/api/customers/:userId/credit", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { amount }: CreditInput = req.body;
  
  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "Amount must be a positive number" });
    return;
  }

  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
    UpdateExpression: "ADD availableCredit :amount",
    ExpressionAttributeValues: {
      ":amount": amount,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const command = new UpdateCommand(params);
    const response = await docClient.send(command);
    res.json(response.Attributes as Customer);
  } catch (error) {
    next(error);
  }
});

// List all customers sorted by available credit
app.get("/api/customers", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const params = {
    TableName: USERS_TABLE,
  };

  try {
    const command = new ScanCommand(params);
    const response = await docClient.send(command);
    
    // Sort customers by available credit in descending order
    const sortedCustomers = (response.Items as Customer[]).sort((a, b) => 
      (b.availableCredit || 0) - (a.availableCredit || 0)
    );
    
    res.json(sortedCustomers);
  } catch (error) {
    next(error);
  }
});

// Add error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req: Request, res: Response): void => {
  res.status(404).json({
    error: "Not Found",
    path: req.path
  });
});

export const handler = serverless(app);
