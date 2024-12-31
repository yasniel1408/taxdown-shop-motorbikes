import "reflect-metadata";
import { DynamoDBCustomerAdapter } from "../DynamoDBCustomerAdapter";
import { CustomerDao } from "../dao/CustomerDao";
import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Mock the DynamoDB Client
jest.mock('@aws-sdk/client-dynamodb', () => ({
    ...jest.requireActual('@aws-sdk/client-dynamodb'),
    DynamoDBClient: jest.fn(),
    ReturnValue: {
        ALL_NEW: 'ALL_NEW'
    }
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
    DynamoDBDocumentClient: {
        from: jest.fn(() => ({
            send: jest.fn()
        }))
    },
    PutCommand: jest.fn(),
    GetCommand: jest.fn(),
    UpdateCommand: jest.fn(),
    DeleteCommand: jest.fn(),
    ScanCommand: jest.fn(),
    QueryCommand: jest.fn()
}));

describe('DynamoDBCustomerAdapter', () => {
    let adapter: DynamoDBCustomerAdapter;
    let mockDocClient: jest.Mocked<DynamoDBDocumentClient>;
    const tableName = 'customers-table-dev';

    beforeEach(() => {
        process.env.CUSTOMERS_TABLE = tableName;
        jest.clearAllMocks();
        
        // Setup mock implementation
        mockDocClient = {
            send: jest.fn()
        } as any;
        
        (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue(mockDocClient);
        
        adapter = new DynamoDBCustomerAdapter();
    });

    describe('save', () => {
        it('should save a customer successfully', async () => {
            const customerDao: CustomerDao = {
                userId: 'test-id',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 1000,
                createdAt: new Date().toISOString()
            };

            mockDocClient.send.mockResolvedValueOnce({} as never);

            const result = await adapter.save(customerDao);

            expect(PutCommand).toHaveBeenCalledWith({
                TableName: tableName,
                Item: customerDao
            });
            expect(result).toEqual(customerDao);
        });

        it('should handle errors when saving fails', async () => {
            const customerDao: CustomerDao = {
                userId: 'test-id',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 1000,
                createdAt: new Date().toISOString()
            };

            const error = new Error('DynamoDB error');
            mockDocClient.send.mockRejectedValueOnce(error as never);

            await expect(adapter.save(customerDao)).rejects.toThrow('DynamoDB error');
        });
    });

    describe('findById', () => {
        it('should find a customer by id successfully', async () => {
            const customerId = 'test-id';
            const customerDao: CustomerDao = {
                userId: customerId,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 1000,
                createdAt: new Date().toISOString()
            };

            mockDocClient.send.mockResolvedValueOnce({ Item: customerDao }as never);

            const result = await adapter.findById(customerId);

            expect(GetCommand).toHaveBeenCalledWith({
                TableName: tableName,
                Key: { userId: customerId }
            });
            expect(result).toEqual(customerDao);
        });

        it('should return undefined when customer is not found', async () => {
            const customerId = 'non-existent-id';
            mockDocClient.send.mockResolvedValueOnce({ Item: undefined } as never);

            const result = await adapter.findById(customerId);

            expect(GetCommand).toHaveBeenCalledWith({
                TableName: tableName,
                Key: { userId: customerId }
            });
            expect(result).toBeUndefined();
        });
    });

    describe('findAll', () => {
        it('should return all customers successfully', async () => {
            const customers: CustomerDao[] = [
                {
                    userId: 'id1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    availableCredit: 1000,
                    createdAt: new Date().toISOString()
                },
                {
                    userId: 'id2',
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    phone: '0987654321',
                    availableCredit: 2000,
                    createdAt: new Date().toISOString()
                }
            ];

            mockDocClient.send.mockResolvedValueOnce({ Items: customers }as never);

            const result = await adapter.findAll();

            expect(ScanCommand).toHaveBeenCalledWith({
                TableName: tableName
            });
            expect(result).toEqual(customers);
        });
    });

    describe('findAllSortedByCredit', () => {
        it('should return customers sorted by credit', async () => {
            const customers: CustomerDao[] = [
                {
                    userId: 'id1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    availableCredit: 2000,
                    createdAt: new Date().toISOString()
                },
                {
                    userId: 'id2',
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    phone: '0987654321',
                    availableCredit: 1000,
                    createdAt: new Date().toISOString()
                }
            ];

            mockDocClient.send.mockResolvedValueOnce({ Items: customers }as never);

            const result = await adapter.findAllSortedByCredit();

            expect(ScanCommand).toHaveBeenCalledWith({
                TableName: tableName,
                IndexName: 'CreditIndex',
                ScanIndexForward: true
              });
            expect(result).toEqual(customers);
        });
    });

    describe('delete', () => {
        it('should delete a customer successfully', async () => {
            const customerId = 'test-id';

            mockDocClient.send.mockResolvedValueOnce({}as never);

            await adapter.delete(customerId);

            expect(DeleteCommand).toHaveBeenCalledWith({
                TableName: tableName,
                Key: { userId: customerId }
            });
        });

        it('should handle errors when deleting fails', async () => {
            const customerId = 'test-id';
            const error = new Error('DynamoDB error');
            mockDocClient.send.mockRejectedValueOnce(error as never);

            await expect(adapter.delete(customerId)).rejects.toThrow('DynamoDB error');
        });
    });

    describe('update', () => {
        it('should update a customer successfully', async () => {
            const customerDao: CustomerDao = {
                userId: 'test-id',
                name: 'John Doe Updated',
                email: 'john.updated@example.com',
                phone: '9999999999',
                availableCredit: 1500,
                createdAt: new Date().toISOString()
            };

            mockDocClient.send.mockResolvedValueOnce({
                Attributes: customerDao
            } as never);

            await adapter.update(customerDao);

            expect(UpdateCommand).toHaveBeenCalledWith({
                TableName: tableName,
                Key: { userId: customerDao.userId },
                UpdateExpression: "SET #name = :name, email = :email, phone = :phone, availableCredit = :availableCredit, createdAt = :createdAt",
                ExpressionAttributeNames: {
                    "#name": "name"
                },
                ExpressionAttributeValues: {
                    ":name": customerDao.name,
                    ":email": customerDao.email,
                    ":phone": customerDao.phone,
                    ":availableCredit": customerDao.availableCredit,
                    ":createdAt": customerDao.createdAt
                },
                ReturnValues: ReturnValue.ALL_NEW
            });
        });

        it('should handle errors when updating fails', async () => {
            const customerDao: CustomerDao = {
                userId: 'test-id',
                name: 'John Doe Updated',
                email: 'john.updated@example.com',
                phone: '9999999999',
                availableCredit: 1500,
                createdAt: new Date().toISOString()
            };

            const error = new Error('DynamoDB error');
            mockDocClient.send.mockRejectedValueOnce(error as never);

            await expect(adapter.update(customerDao)).rejects.toThrow('DynamoDB error');
        });
    });
});
