import "reflect-metadata";
import { UpdateCustomerService } from '../UpdateCustomerService';
import { CustomerDatabasePort } from '../../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../../infrastructure/adapters/out/dynamodb/dao/CustomerDao';
import { UpdateCustomerDtoRequest } from '../../infrastructure/adapters/in/http/dtos/request/UpdateCustomerDtoRequest';

describe('UpdateCustomerService', () => {
    let mockCustomerDb: jest.Mocked<CustomerDatabasePort<CustomerDao>>;
    let service: UpdateCustomerService;

    beforeEach(() => {
        mockCustomerDb = {
            findById: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findAllSortedByCredit: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        service = new UpdateCustomerService(mockCustomerDb as any);
    });

    it('should update customer successfully', async () => {
        // Arrange
        const customerId = 'test-id';
        const existingCustomer: CustomerDao = {
            userId: customerId,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            availableCredit: 1000,
            createdAt: new Date().toString()
        };

        const updateDto: UpdateCustomerDtoRequest = {
            name: 'John Doe Updated',
            email: 'john.updated@example.com',
            phone: '0987654321',
        };

        const updatedCustomer: CustomerDao = {
            ...existingCustomer,
            ...updateDto
        };

        mockCustomerDb.findById.mockResolvedValue(existingCustomer);
        mockCustomerDb.update.mockResolvedValue(updatedCustomer);

        // Act
        const result = await service.execute(customerId, updateDto);

        // Assert
        expect(result.name).toBe(updateDto.name);
        expect(result.email).toBe(updateDto.email);
        expect(result.phone).toBe(updateDto.phone);
        expect(mockCustomerDb.findById).toHaveBeenCalledWith(customerId);
        expect(mockCustomerDb.update).toHaveBeenCalled();
    });

    it('should throw error when customer not found', async () => {
        // Arrange
        const customerId = 'non-existent-id';
        const updateDto: UpdateCustomerDtoRequest = {
            name: 'John Doe Updated',
            email: 'john.updated@example.com',
            phone: '0987654321',
        };

        mockCustomerDb.findById.mockResolvedValue(undefined as any);

        // Act & Assert
        await expect(service.execute(customerId, updateDto))
            .rejects
            .toThrow('CUSTOMER_NOT_FOUND');
        expect(mockCustomerDb.findById).toHaveBeenCalledWith(customerId);
        expect(mockCustomerDb.update).not.toHaveBeenCalled();
    });

    it('should update customer without phone number', async () => {
        // Arrange
        const customerId = 'test-id';
        const existingCustomer: CustomerDao = {
            userId: customerId,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            availableCredit: 1000,
            createdAt: new Date().toString()
        };

        const updateDto: UpdateCustomerDtoRequest = {
            name: 'John Doe Updated',
            email: 'john.updated@example.com',
            phone: '0987654321'
        };

        const updatedCustomer: CustomerDao = {
            ...existingCustomer,
            ...updateDto,
            phone: undefined
        };

        mockCustomerDb.findById.mockResolvedValue(existingCustomer);
        mockCustomerDb.update.mockResolvedValue(updatedCustomer);

        // Act
        const result = await service.execute(customerId, updateDto);

        // Assert
        expect(result.phone).toBeUndefined();
        expect(mockCustomerDb.update).toHaveBeenCalled();
    });
});
