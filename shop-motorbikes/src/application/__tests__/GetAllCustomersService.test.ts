import "reflect-metadata";
import { GetAllCustomersService } from '../GetAllCustomersService';
import { CustomerDatabasePort } from '../../domain/ports/out/CustomerDatabasePort';
import { CustomerDao } from '../../infrastructure/adapters/out/dynamodb/dao/CustomerDao';

describe('GetAllCustomersService', () => {
    let mockCustomerDb: jest.Mocked<CustomerDatabasePort<CustomerDao>>;
    let service: GetAllCustomersService;

    beforeEach(() => {
        mockCustomerDb = {
            findById: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findAllSortedByCredit: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        service = new GetAllCustomersService(mockCustomerDb as any);
    });

    it('should return all customers without sorting', async () => {
        // Arrange
        const mockCustomers: CustomerDao[] = [
            {
                userId: '1',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 1000,
                createdAt: new Date().toString()
            },
            {
                userId: '2',
                name: 'Jane Doe',
                email: 'jane@example.com',
                phone: '0987654321',
                availableCredit: 2000,
                createdAt: new Date().toString()
            }
        ];

        mockCustomerDb.findAll.mockResolvedValue(mockCustomers);

        // Act
        const result = await service.execute(false);

        // Assert
        expect(result).toHaveLength(2);
        expect(mockCustomerDb.findAll).toHaveBeenCalled();
        expect(mockCustomerDb.findAllSortedByCredit).not.toHaveBeenCalled();
        expect(result[0].userId).toBe('1');
        expect(result[1].userId).toBe('2');
    });

    it('should return all customers sorted by credit', async () => {
        // Arrange
        const mockCustomers: CustomerDao[] = [
            {
                userId: '1',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                availableCredit: 2000,
                createdAt: new Date().toString()
            },
            {
                userId: '2',
                name: 'Jane Doe',
                email: 'jane@example.com',
                phone: '0987654321',
                availableCredit: 1000,
                createdAt: new Date().toString()
            }
        ];

        mockCustomerDb.findAllSortedByCredit.mockResolvedValue(mockCustomers);

        // Act
        const result = await service.execute(true);

        // Assert
        expect(result).toHaveLength(2);
        expect(mockCustomerDb.findAllSortedByCredit).toHaveBeenCalled();
        expect(mockCustomerDb.findAll).not.toHaveBeenCalled();
        expect(result[0].availableCredit).toBe(2000);
        expect(result[1].availableCredit).toBe(1000);
    });

    it('should return empty array when no customers exist', async () => {
        // Arrange
        mockCustomerDb.findAll.mockResolvedValue([]);

        // Act
        const result = await service.execute(false);

        // Assert
        expect(result).toHaveLength(0);
        expect(mockCustomerDb.findAll).toHaveBeenCalled();
    });
});
