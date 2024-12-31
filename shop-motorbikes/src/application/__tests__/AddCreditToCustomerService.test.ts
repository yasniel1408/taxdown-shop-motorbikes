import "reflect-metadata";
import { AddCreditToCustomerService } from '../AddCreditToCustomerService';
import { CustomerDatabasePort } from '../../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../../infrastructure/adapters/out/dynamodb/dao/CustomerDao';

describe('AddCreditToCustomerService', () => {
    let mockCustomerDb: jest.Mocked<CustomerDatabasePort<CustomerDao>>;
    let service: AddCreditToCustomerService;

    beforeEach(() => {
        mockCustomerDb = {
            findById: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findAllSortedByCredit: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        service = new AddCreditToCustomerService(mockCustomerDb as any);
    });

    it('should add credit to an existing customer', async () => {
        // Arrange
        const customerId = 'test-id';
        const initialCredit = 1000;
        const creditToAdd = 500;
        const mockCustomer: CustomerDao = {
            userId: customerId,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            availableCredit: initialCredit,
            createdAt: new Date().toString()
        };

        mockCustomerDb.findById.mockResolvedValue(mockCustomer);
        mockCustomerDb.update.mockResolvedValue({
            ...mockCustomer,
            availableCredit: initialCredit + creditToAdd
        });

        // Act
        const result = await service.execute(customerId, creditToAdd);

        // Assert
        expect(result.availableCredit).toBe(initialCredit + creditToAdd);
        expect(mockCustomerDb.findById).toHaveBeenCalledWith(customerId);
        expect(mockCustomerDb.update).toHaveBeenCalled();
    });

    it('should throw error when customer not found', async () => {
        // Arrange
        const customerId = 'non-existent-id';
        mockCustomerDb.findById.mockResolvedValue(undefined as any);

        // Act & Assert
        await expect(service.execute(customerId, 100))
            .rejects
            .toThrow('Customer not found');
    });

    it('should throw error when trying to add negative credit', async () => {
        // Arrange
        const customerId = 'test-id';
        const mockCustomer: CustomerDao = {
            userId: customerId,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            availableCredit: 1000,
            createdAt: new Date().toString()
        };

        mockCustomerDb.findById.mockResolvedValue(mockCustomer);

        // Act & Assert
        await expect(service.execute(customerId, -100))
            .rejects
            .toThrow('Credit amount cannot be negative');
    });
});
