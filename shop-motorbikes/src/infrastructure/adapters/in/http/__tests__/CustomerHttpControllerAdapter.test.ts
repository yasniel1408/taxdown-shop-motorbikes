import "reflect-metadata";
import { CustomerHttpControllerAdapter } from '../CustomerHttpControllerAdapter';
import { GetAllCustomersService } from '../../../../../application/GetAllCustomersService';
import { GetCustomerByIdService } from '../../../../../application/GetCustomerByIdService';
import { CreateCustomerService } from '../../../../../application/CreateCustomerService';
import { UpdateCustomerService } from '../../../../../application/UpdateCustomerService';
import { DeleteCustomerService } from '../../../../../application/DeleteCustomerService';
import { AddCreditToCustomerService } from '../../../../../application/AddCreditToCustomerService';
import { Request, Response, NextFunction } from 'express';
import { CustomerDao } from '../../../out/dynamodb/dao/CustomerDao';

jest.mock('../../../../../application/GetAllCustomersService');
jest.mock('../../../../../application/GetCustomerByIdService');
jest.mock('../../../../../application/CreateCustomerService');
jest.mock('../../../../../application/UpdateCustomerService');
jest.mock('../../../../../application/DeleteCustomerService');
jest.mock('../../../../../application/AddCreditToCustomerService');

describe('CustomerHttpControllerAdapter', () => {
    let adapter: CustomerHttpControllerAdapter;
    let mockGetAllCustomersService: jest.Mocked<GetAllCustomersService>;
    let mockGetCustomerByIdService: jest.Mocked<GetCustomerByIdService>;
    let mockCreateCustomerService: jest.Mocked<CreateCustomerService>;
    let mockUpdateCustomerService: jest.Mocked<UpdateCustomerService>;
    let mockDeleteCustomerService: jest.Mocked<DeleteCustomerService>;
    let mockAddCreditToCustomerService: jest.Mocked<AddCreditToCustomerService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockGetAllCustomersService = {
            execute: jest.fn()
        } as any;
        mockGetCustomerByIdService = {
            execute: jest.fn()
        } as any;
        mockCreateCustomerService = {
            execute: jest.fn()
        } as any;
        mockUpdateCustomerService = {
            execute: jest.fn()
        } as any;
        mockDeleteCustomerService = {
            execute: jest.fn()
        } as any;
        mockAddCreditToCustomerService = {
            execute: jest.fn()
        } as any;

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();

        adapter = new CustomerHttpControllerAdapter(
            mockCreateCustomerService,
            mockGetCustomerByIdService,
            mockUpdateCustomerService,
            mockDeleteCustomerService,
            mockAddCreditToCustomerService,
            mockGetAllCustomersService
        );
    });

    describe('getAllCustomers', () => {
        it('should get all customers successfully', async () => {
            const customers = [
                {
                    userId: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    availableCredit: 1000,
                    createdAt: new Date().toISOString()
                }
            ];
            mockGetAllCustomersService.execute.mockResolvedValueOnce(customers);
            mockRequest.query = {};

            await adapter.getAllCustomers(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockGetAllCustomersService.execute).toHaveBeenCalledWith(false);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(customers);
        });

        it('should sort customers by credit when sortByCredit is true', async () => {
            const customers = [
                {
                    userId: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    availableCredit: 2000,
                    createdAt: new Date().toISOString()
                }
            ];
            mockGetAllCustomersService.execute.mockResolvedValueOnce(customers);
            mockRequest.query = { sortByCredit: 'true' };

            await adapter.getAllCustomers(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockGetAllCustomersService.execute).toHaveBeenCalledWith(true);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(customers);
        });

        it('should handle errors when getting customers', async () => {
            mockGetAllCustomersService.execute.mockRejectedValueOnce(new Error('Service error'));
            mockRequest.query = {};

            await adapter.getAllCustomers(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Service error'));
        });
    });

    describe('getCustomerById', () => {
        const customerId = 'test-id';

        it('should get a customer by id successfully', async () => {
            const customer = {
                userId: customerId,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 1000,
                createdAt: new Date().toISOString()
            };
            mockGetCustomerByIdService.execute.mockResolvedValueOnce(customer);
            mockRequest.params = { id: customerId };

            await adapter.getCustomerById(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(customer);
        });

        it('should handle errors when getting customer by id', async () => {
            mockGetCustomerByIdService.execute.mockRejectedValueOnce(new Error('Service error'));
            mockRequest.params = { id: customerId };

            await adapter.getCustomerById(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Service error'));
        });
    });

    describe('createCustomer', () => {
        const customerData: Omit<CustomerDao, 'userId' | 'createdAt'> = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            availableCredit: 1000
        };

        it('should create a customer successfully', async () => {
            const createdCustomer = {
                ...customerData,
                userId: 'new-id',
                createdAt: new Date().toISOString()
            };
            mockCreateCustomerService.execute.mockResolvedValueOnce(createdCustomer);
            mockRequest.body = customerData;

            await adapter.createCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockCreateCustomerService.execute).toHaveBeenCalledWith(customerData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(createdCustomer);
        });

        it('should handle errors when creating customer', async () => {
            mockCreateCustomerService.execute.mockRejectedValueOnce(new Error('Service error'));
            mockRequest.body = customerData;

            await adapter.createCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Service error'));
        });
    });

    describe('updateCustomer', () => {
        const customerId = 'test-id';
        const customerData: CustomerDao = {
            userId: customerId,
            name: 'John Doe Updated',
            email: 'john@example.com',
            phone: '1234567890',
            availableCredit: 2000,
            createdAt: new Date().toISOString()
        };

        it('should update a customer successfully', async () => {
            mockUpdateCustomerService.execute.mockResolvedValueOnce(customerData);
            mockRequest.params = { id: customerId };
            mockRequest.body = customerData;

            await adapter.updateCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(customerData);
        });

        it('should handle errors when updating customer', async () => {
            mockUpdateCustomerService.execute.mockRejectedValueOnce(new Error('Service error'));
            mockRequest.params = { id: customerId };
            mockRequest.body = customerData;

            await adapter.updateCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Service error'));
        });
    });

    describe('deleteCustomer', () => {
        const customerId = 'test-id';

        it('should delete a customer successfully', async () => {
            mockRequest.params = { id: customerId };

            await adapter.deleteCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(204);
        });

        it('should handle errors when deleting a customer', async () => {
            mockDeleteCustomerService.execute.mockRejectedValueOnce(new Error('Service error'));
            mockRequest.params = { id: customerId };

            await adapter.deleteCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Service error'));
        });
    });

    describe('addCredit', () => {
        const customerId = 'test-id';
        const availableCredit = 500;

        it('should add credit to a customer successfully', async () => {
            const updatedCustomer = {
                userId: customerId,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 1500,
                createdAt: new Date().toISOString()
            };
            mockAddCreditToCustomerService.execute.mockResolvedValueOnce(updatedCustomer);
            mockRequest.params = { id: customerId };
            mockRequest.body = { amount: availableCredit };

            await adapter.addCredit(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedCustomer);
        });

        it('should handle errors when adding credit', async () => {
            mockAddCreditToCustomerService.execute.mockRejectedValueOnce(new Error('Service error'));
            mockRequest.params = { id: customerId };
            mockRequest.body = { amount: availableCredit };

            await adapter.addCredit(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Service error'));
        });
    });
});
