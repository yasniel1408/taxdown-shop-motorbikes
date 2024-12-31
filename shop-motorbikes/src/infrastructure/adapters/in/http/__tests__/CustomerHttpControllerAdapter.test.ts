import "reflect-metadata";
import { CustomerHttpControllerAdapter } from "../CustomerHttpControllerAdapter";
import { CreateCustomerService } from "../../../../../application/CreateCustomerService";
import { GetCustomerByIdService } from "../../../../../application/GetCustomerByIdService";
import { UpdateCustomerService } from "../../../../../application/UpdateCustomerService";
import { DeleteCustomerService } from "../../../../../application/DeleteCustomerService";
import { AddCreditToCustomerService } from "../../../../../application/AddCreditToCustomerService";
import { GetAllCustomersService } from "../../../../../application/GetAllCustomersService";
import { Request, Response, NextFunction } from 'express';
import { CustomerDtoResponse } from "../dtos/response/CustomerDtoResponse";
import { CreateCustomerDtoRequest } from "../dtos/request/CreateCustomerDtoRequest";
import { UpdateCustomerDtoRequest } from "../dtos/request/UpdateCustomerDtoRequest";
import { AddCreditDtoRequest } from "../dtos/request/AddCreditDtoRequest";

jest.mock("../../../../../application/CreateCustomerService");
jest.mock("../../../../../application/GetCustomerByIdService");
jest.mock("../../../../../application/UpdateCustomerService");
jest.mock("../../../../../application/DeleteCustomerService");
jest.mock("../../../../../application/AddCreditToCustomerService");
jest.mock("../../../../../application/GetAllCustomersService");

describe('CustomerHttpControllerAdapter', () => {
    let adapter: CustomerHttpControllerAdapter;
    let mockCreateCustomerService: jest.Mocked<CreateCustomerService>;
    let mockGetCustomerByIdService: jest.Mocked<GetCustomerByIdService>;
    let mockUpdateCustomerService: jest.Mocked<UpdateCustomerService>;
    let mockDeleteCustomerService: jest.Mocked<DeleteCustomerService>;
    let mockAddCreditToCustomerService: jest.Mocked<AddCreditToCustomerService>;
    let mockGetAllCustomersService: jest.Mocked<GetAllCustomersService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockCreateCustomerService = {
            execute: jest.fn()
        } as any;
        mockGetCustomerByIdService = {
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
        mockGetAllCustomersService = {
            execute: jest.fn()
        } as any;

        adapter = new CustomerHttpControllerAdapter(
            mockCreateCustomerService,
            mockGetCustomerByIdService,
            mockUpdateCustomerService,
            mockDeleteCustomerService,
            mockAddCreditToCustomerService,
            mockGetAllCustomersService
        );

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    describe('createCustomer', () => {
        it('should create a customer successfully', async () => {
            const customerDto: CreateCustomerDtoRequest = {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 1000
            };

            const expectedResponse: CustomerDtoResponse = {
                userId: 'test-id',
                name: customerDto.name,
                email: customerDto.email,
                phone: customerDto.phone,
                availableCredit: customerDto.availableCredit,
                createdAt: new Date().toISOString()
            };

            mockRequest = {
                body: customerDto
            };

            mockCreateCustomerService.execute.mockResolvedValue(expectedResponse);

            await adapter.createCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockCreateCustomerService.execute).toHaveBeenCalledWith(customerDto);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle errors when creating a customer', async () => {
            const error = new Error('Creation failed');
            mockRequest = {
                body: {}
            };

            mockCreateCustomerService.execute.mockRejectedValue(error);

            await adapter.createCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getCustomerById', () => {
        it('should get a customer by id successfully', async () => {
            const customerId = 'test-id';
            const expectedResponse: CustomerDtoResponse = {
                userId: customerId,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 1000,
                createdAt: new Date().toISOString()
            };

            mockRequest = {
                params: { userId: customerId }
            };

            mockGetCustomerByIdService.execute.mockResolvedValue(expectedResponse);

            await adapter.getCustomerById(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockGetCustomerByIdService.execute).toHaveBeenCalledWith(customerId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle errors when getting a customer', async () => {
            const error = new Error('Customer not found');
            mockRequest = {
                params: { userId: 'non-existent-id' }
            };

            mockGetCustomerByIdService.execute.mockRejectedValue(error);

            await adapter.getCustomerById(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('updateCustomer', () => {
        it('should update a customer successfully', async () => {
            const customerId = 'test-id';
            const updateDto: UpdateCustomerDtoRequest = {
                name: 'John Doe Updated',
                email: 'john.updated@example.com'
            };

            const expectedResponse: CustomerDtoResponse = {
                userId: customerId,
                name: updateDto.name!,
                email: updateDto.email!,
                availableCredit: 1000,
                createdAt: new Date().toISOString()
            };

            mockRequest = {
                params: { userId: customerId },
                body: updateDto
            };

            mockUpdateCustomerService.execute.mockResolvedValue(expectedResponse);

            await adapter.updateCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockUpdateCustomerService.execute).toHaveBeenCalledWith(customerId, updateDto);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle errors when updating a customer', async () => {
            const error = new Error('Update failed');
            mockRequest = {
                params: { userId: 'test-id' },
                body: {}
            };

            mockUpdateCustomerService.execute.mockRejectedValue(error);

            await adapter.updateCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteCustomer', () => {
        it('should delete a customer successfully', async () => {
            const customerId = 'test-id';
            mockRequest = {
                params: { userId: customerId }
            };

            await adapter.deleteCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockDeleteCustomerService.execute).toHaveBeenCalledWith(customerId);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.json).toHaveBeenCalledWith();
        });

        it('should handle errors when deleting a customer', async () => {
            const error = new Error('Delete failed');
            mockRequest = {
                params: { userId: 'test-id' }
            };

            mockDeleteCustomerService.execute.mockRejectedValue(error);

            await adapter.deleteCustomer(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('addCredit', () => {
        it('should add credit to a customer successfully', async () => {
            const customerId = 'test-id';
            const creditDto: AddCreditDtoRequest = {
                amount: 500
            };

            const expectedResponse: CustomerDtoResponse = {
                userId: customerId,
                name: 'John Doe',
                email: 'john@example.com',
                availableCredit: 1500,
                createdAt: new Date().toISOString()
            };

            mockRequest = {
                params: { userId: customerId },
                body: creditDto
            };

            mockAddCreditToCustomerService.execute.mockResolvedValue(expectedResponse);

            await adapter.addCredit(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockAddCreditToCustomerService.execute).toHaveBeenCalledWith(customerId, creditDto.amount);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle errors when adding credit', async () => {
            const error = new Error('Add credit failed');
            mockRequest = {
                params: { userId: 'test-id' },
                body: { amount: -100 }
            };

            mockAddCreditToCustomerService.execute.mockRejectedValue(error);

            await adapter.addCredit(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getAllCustomers', () => {
        it('should get all customers successfully', async () => {
            const expectedResponse: CustomerDtoResponse[] = [
                {
                    userId: 'test-id-1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    availableCredit: 1000,
                    createdAt: new Date().toISOString()
                },
                {
                    userId: 'test-id-2',
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    availableCredit: 2000,
                    createdAt: new Date().toISOString()
                }
            ];

            mockRequest = {
                query: { sortByCredit: 'true' }
            };

            mockGetAllCustomersService.execute.mockResolvedValue(expectedResponse);

            await adapter.getAllCustomers(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockGetAllCustomersService.execute).toHaveBeenCalledWith(true);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle errors when getting all customers', async () => {
            const error = new Error('Get all failed');
            mockRequest = {
                query: {}
            };

            mockGetAllCustomersService.execute.mockRejectedValue(error);

            await adapter.getAllCustomers(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
