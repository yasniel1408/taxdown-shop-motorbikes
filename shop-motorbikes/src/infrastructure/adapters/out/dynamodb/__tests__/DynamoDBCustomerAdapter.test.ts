import "reflect-metadata";
import { DynamoDBCustomerAdapter } from "../DynamoDBCustomerAdapter";
import { CustomerDao } from "../dao/CustomerDao";
import { DynamoDB } from "aws-sdk";

// Mock the DynamoDB DocumentClient
jest.mock('aws-sdk', () => ({
    DynamoDB: {
        DocumentClient: jest.fn(() => ({
            put: jest.fn().mockImplementation((params) => ({
                promise: jest.fn().mockResolvedValue({})
            })),
            get: jest.fn().mockImplementation((params) => ({
                promise: jest.fn().mockResolvedValue({})
            })),
            update: jest.fn().mockImplementation((params) => ({
                promise: jest.fn().mockResolvedValue({})
            })),
            delete: jest.fn().mockImplementation((params) => ({
                promise: jest.fn().mockResolvedValue({})
            })),
            scan: jest.fn().mockImplementation((params) => ({
                promise: jest.fn().mockResolvedValue({})
            }))
        }))
    }
}));

describe('DynamoDBCustomerAdapter', () => {
    let adapter: DynamoDBCustomerAdapter;
    let mockDocClient: jest.Mocked<DynamoDB.DocumentClient>;

    beforeEach(() => {
        jest.clearAllMocks();
        adapter = new DynamoDBCustomerAdapter();
        mockDocClient = new DynamoDB.DocumentClient() as jest.Mocked<DynamoDB.DocumentClient>;
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

            const mockPut = mockDocClient.put as jest.Mock;
            mockPut.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({})
            }));

            const result = await adapter.save(customerDao);

            expect(mockPut).toHaveBeenCalledWith({
                TableName: 'Customers',
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
            const mockPut = mockDocClient.put as jest.Mock;
            mockPut.mockImplementation(() => ({
                promise: jest.fn().mockRejectedValue(error)
            }));

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

            const mockGet = mockDocClient.get as jest.Mock;
            mockGet.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({ Item: customerDao })
            }));

            const result = await adapter.findById(customerId);

            expect(mockGet).toHaveBeenCalledWith({
                TableName: 'Customers',
                Key: { userId: customerId }
            });
            expect(result).toEqual(customerDao);
        });

        it('should return undefined when customer is not found', async () => {
            const customerId = 'non-existent-id';

            const mockGet = mockDocClient.get as jest.Mock;
            mockGet.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({})
            }));

            const result = await adapter.findById(customerId);

            expect(result).toBeUndefined();
        });

    });

    describe('update', () => {
        it('should update a customer successfully', async () => {
            const customerDao: CustomerDao = {
                userId: 'test-id',
                name: 'John Doe Updated',
                email: 'john.updated@example.com',
                phone: '0987654321',
                availableCredit: 2000,
                createdAt: new Date().toISOString()
            };

            const mockUpdate = mockDocClient.update as jest.Mock;
            mockUpdate.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({ Attributes: customerDao })
            }));

            const result = await adapter.update(customerDao);

            expect(mockUpdate).toHaveBeenCalledWith({
                TableName: 'Customers',
                Key: { userId: customerDao.userId },
                UpdateExpression: expect.any(String),
                ExpressionAttributeValues: expect.any(Object),
                ReturnValues: 'ALL_NEW'
            });
            expect(result).toEqual(customerDao);
        });

    });

    describe('delete', () => {
        it('should delete a customer successfully', async () => {
            const customerId = 'test-id';

            const mockDelete = mockDocClient.delete as jest.Mock;
            mockDelete.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({})
            }));

            await adapter.delete(customerId);

            expect(mockDelete).toHaveBeenCalledWith({
                TableName: 'Customers',
                Key: { userId: customerId }
            });
        });

    });

    describe('findAll', () => {
        it('should find all customers successfully', async () => {
            const customers: CustomerDao[] = [
                {
                    userId: 'test-id-1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    availableCredit: 1000,
                    createdAt: new Date().toISOString()
                },
                {
                    userId: 'test-id-2',
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    phone: '0987654321',
                    availableCredit: 2000,
                    createdAt: new Date().toISOString()
                }
            ];

            const mockScan = mockDocClient.scan as jest.Mock;
            mockScan.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({ Items: customers })
            }));

            const result = await adapter.findAll();

            expect(mockScan).toHaveBeenCalledWith({
                TableName: 'Customers'
            });
            expect(result).toEqual(customers);
        });

        it('should return empty array when no customers exist', async () => {
            const mockScan = mockDocClient.scan as jest.Mock;
            mockScan.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({ Items: [] })
            }));

            const result = await adapter.findAll();

            expect(result).toEqual([]);
        });

        it('should handle errors when finding all customers fails', async () => {
            const error = new Error('DynamoDB error');
            
            const mockScan = mockDocClient.scan as jest.Mock;
            mockScan.mockImplementation(() => ({
                promise: jest.fn().mockRejectedValue(error)
            }));

            await expect(adapter.findAll()).rejects.toThrow('DynamoDB error');
        });
    });

    describe('findAllSortedByCredit', () => {
        it('should find all customers sorted by credit successfully', async () => {
            const customers: CustomerDao[] = [
                {
                    userId: 'test-id-1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    availableCredit: 2000,
                    createdAt: new Date().toISOString()
                },
                {
                    userId: 'test-id-2',
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    phone: '0987654321',
                    availableCredit: 1000,
                    createdAt: new Date().toISOString()
                }
            ];

            const mockScan = mockDocClient.scan as jest.Mock;
            mockScan.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({ Items: customers })
            }));

            const result = await adapter.findAllSortedByCredit();

            expect(mockScan).toHaveBeenCalledWith({
                TableName: 'Customers'
            });
            expect(result).toEqual(customers.sort((a, b) => b.availableCredit - a.availableCredit));
        });

        it('should return empty array when no customers exist', async () => {
            const mockScan = mockDocClient.scan as jest.Mock;
            mockScan.mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({ Items: [] })
            }));

            const result = await adapter.findAllSortedByCredit();

            expect(result).toEqual([]);
        });
    });
});
