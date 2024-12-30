import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { CustomerRepository } from "../../../../application/ports/out/CustomerRepository";
import { Customer } from "../../../../domain/entities/Customer";
import { Credit } from "../../../../domain/value-objects/Credit";

export class DynamoDBCustomerRepository implements CustomerRepository {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    const client = new DynamoDBClient();
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = process.env.USERS_TABLE as string;
  }

  private toDomain(record: any): Customer {
    return Customer.create(
      record.userId,
      record.name,
      record.email,
      record.phone,
      record.availableCredit
    );
  }

  async save(customer: Customer): Promise<Customer> {
    const params = {
      TableName: this.tableName,
      Item: customer.toJSON(),
    };

    await this.docClient.send(new PutCommand(params));
    return customer;
  }

  async findById(userId: string): Promise<Customer | null> {
    const params = {
      TableName: this.tableName,
      Key: { userId },
    };

    const result = await this.docClient.send(new GetCommand(params));
    return result.Item ? this.toDomain(result.Item) : null;
  }

  async findAll(): Promise<Customer[]> {
    const params = {
      TableName: this.tableName,
    };

    const result = await this.docClient.send(new ScanCommand(params));
    return (result.Items || []).map(item => this.toDomain(item));
  }

  async delete(userId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { userId },
    };

    await this.docClient.send(new DeleteCommand(params));
  }

  async update(customer: Customer): Promise<Customer> {
    const params = {
      TableName: this.tableName,
      Key: {
        userId: customer.id,
      },
      UpdateExpression: "set #name = :name, email = :email, phone = :phone, availableCredit = :availableCredit",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": customer.name,
        ":email": customer.email,
        ":phone": customer.phone,
        ":availableCredit": customer.credit,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await this.docClient.send(new UpdateCommand(params));
    return this.toDomain(result.Attributes);
  }
}
