import "reflect-metadata";
import { GetCustomerByIdService } from '../GetCustomerByIdService';
import { CustomerDatabasePort } from '../../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../../infrastructure/adapters/out/dynamodb/dao/CustomerDao';

describe('GetCustomerByIdService', () => {
    let mockCustomerDb: jest.Mocked<CustomerDatabasePort<CustomerDao>>;
    let service: GetCustomerByIdService;

    beforeEach(() => {
        mockCustomerDb = {
            findById: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findAllSortedByCredit: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        service = new GetCustomerByIdService(mockCustomerDb as any);
    });

    it('should return customer when found', async () => {
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

        // Act
        const result = await service.execute(customerId);

        // Assert
        expect(result.userId).toBe(customerId);
        expect(result.name).toBe(mockCustomer.name);
        expect(result.email).toBe(mockCustomer.email);
        expect(result.phone).toBe(mockCustomer.phone);
        expect(result.availableCredit).toBe(mockCustomer.availableCredit);
        expect(mockCustomerDb.findById).toHaveBeenCalledWith(customerId);
    });

    it('should throw error when customer not found', async () => {
        // Arrange
        const customerId = 'non-existent-id';
        mockCustomerDb.findById.mockResolvedValue(undefined as any);

        // Act & Assert
        await expect(service.execute(customerId))
            .rejects
            .toThrow('CUSTOMER_NOT_FOUND');
        expect(mockCustomerDb.findById).toHaveBeenCalledWith(customerId);
    });
});
