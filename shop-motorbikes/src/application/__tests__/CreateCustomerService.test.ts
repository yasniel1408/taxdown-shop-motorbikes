import "reflect-metadata";
import { CreateCustomerService } from '../CreateCustomerService';
import { CustomerDatabasePort } from '../../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../../infrastructure/adapters/out/dynamodb/dao/CustomerDao';
import { CreateCustomerDtoRequest } from '../../infrastructure/adapters/in/http/dtos/request/CreateCustomerDtoRequest';

describe('CreateCustomerService', () => {
    let mockCustomerDb: jest.Mocked<CustomerDatabasePort<CustomerDao>>;
    let service: CreateCustomerService;

    beforeEach(() => {
        mockCustomerDb = {
            findById: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findAllSortedByCredit: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        service = new CreateCustomerService(mockCustomerDb as any);
    });

    it('should create a new customer successfully', async () => {
        // Arrange
        const customerDto: CreateCustomerDtoRequest = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            availableCredit: 1000
        };

        const mockSavedCustomer: CustomerDao = {
            userId: expect.any(String),
            name: customerDto.name,
            email: customerDto.email,
            phone: customerDto.phone,
            availableCredit: customerDto.availableCredit,
            createdAt: expect.any(String)
        };

        mockCustomerDb.save.mockResolvedValue(mockSavedCustomer);

        // Act
        const result = await service.execute(customerDto);

        // Assert
        expect(result.name).toBe(customerDto.name);
        expect(result.email).toBe(customerDto.email);
        expect(result.phone).toBe(customerDto.phone);
        expect(result.availableCredit).toBe(customerDto.availableCredit);
        expect(result.userId).toBeDefined();
        expect(result.createdAt).toBeDefined();
        expect(mockCustomerDb.save).toHaveBeenCalled();
    });

    it('should create a customer without phone number', async () => {
        // Arrange
        const customerDto: CreateCustomerDtoRequest = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: undefined,
            availableCredit: 1000
        };

        const mockSavedCustomer: CustomerDao = {
            userId: expect.any(String),
            name: customerDto.name,
            email: customerDto.email,
            phone: undefined,
            availableCredit: customerDto.availableCredit,
            createdAt: expect.any(String)
        };

        mockCustomerDb.save.mockResolvedValue(mockSavedCustomer);

        // Act
        const result = await service.execute(customerDto);

        // Assert
        expect(result.phone).toBeUndefined();
        expect(mockCustomerDb.save).toHaveBeenCalled();
    });

    it('should throw error when trying to create customer with negative credit', async () => {
        // Arrange
        const customerDto: CreateCustomerDtoRequest = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            availableCredit: -100
        };

        // Act & Assert
        await expect(service.execute(customerDto))
            .rejects
            .toThrow('Credit amount cannot be negative');
        expect(mockCustomerDb.save).not.toHaveBeenCalled();
    });
});
