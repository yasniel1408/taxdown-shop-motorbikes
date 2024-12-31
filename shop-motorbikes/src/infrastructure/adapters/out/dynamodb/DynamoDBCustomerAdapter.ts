import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { CustomerDao } from "./dao/CustomerDao";
import { CustomerDatabasePort } from "../../../../domain/ports/out/CustomerDatabasePort";
import { injectable } from "tsyringe";

@injectable()
export class DynamoDBCustomerAdapter implements CustomerDatabasePort<CustomerDao> {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    const isDev = process.env.NODE_ENV === 'development' || process.env.IS_OFFLINE;
    
    const client = new DynamoDBClient(isDev ? {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
      }
    } : {
      region: process.env.REGION
    });

    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = process.env.CUSTOMERS_TABLE || 'customers-table-dev';
  }

  async save(customer: CustomerDao) {
    const params = {
      TableName: this.tableName,
      Item: customer,
    };
    await this.docClient.send(new PutCommand(params));
    return customer;
  }

  async findById(userId: string) {
    const params = {
      TableName: this.tableName,
      Key: { userId },
    };
    const result = await this.docClient.send(new GetCommand(params));
    return result.Item as CustomerDao;
  }

  async findAll() {
    const params = {
      TableName: this.tableName,
    };
    const result = await this.docClient.send(new ScanCommand(params));
    return result.Items as CustomerDao[];
  }

  async delete(userId: string) {
    const params = {
      TableName: this.tableName,
      Key: { userId },
    };
    await this.docClient.send(new DeleteCommand(params));
  }

  async update(customer: CustomerDao) {
    const params = {
      TableName: this.tableName,
      Key: {
        userId: customer.userId
      },
      UpdateExpression: "SET #name = :name, email = :email, phone = :phone, availableCredit = :availableCredit, createdAt = :createdAt",
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": customer.name,
        ":email": customer.email,
        ":phone": customer.phone || null,
        ":availableCredit": customer.availableCredit,
        ":createdAt": customer.createdAt
      },
      ReturnValues: ReturnValue.ALL_NEW,
    };

    const result = await this.docClient.send(new UpdateCommand(params));
    return result.Attributes as CustomerDao;
  }
}
