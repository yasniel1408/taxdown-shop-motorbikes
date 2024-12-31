import 'reflect-metadata';
import { DeleteCustomerService } from '../DeleteCustomerService';
import { DynamoDBCustomerAdapter } from '../../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter';
import { container } from 'tsyringe';

// Mock the DynamoDBCustomerAdapter
jest.mock('../../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter');

describe('DeleteCustomerService', () => {
    let service: DeleteCustomerService;
    let mockCustomerAdapter: jest.Mocked<DynamoDBCustomerAdapter>;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Create a fresh mock instance
        mockCustomerAdapter = new DynamoDBCustomerAdapter() as jest.Mocked<DynamoDBCustomerAdapter>;
        
        // Register the mock with the container
        container.registerInstance('DynamoDBCustomerAdapter', mockCustomerAdapter);
        
        // Get the service instance with the mock injected
        service = container.resolve(DeleteCustomerService);
    });

    afterEach(() => {
        // Clear the container after each test
        container.clearInstances();
    });

    it('should successfully delete a customer', async () => {
        const customerId = 'test-customer-id';
        
        // Mock the delete method to resolve successfully
        mockCustomerAdapter.delete.mockResolvedValueOnce();

        // Execute the service
        await service.execute(customerId);

        // Verify the adapter's delete method was called with the correct ID
        expect(mockCustomerAdapter.delete).toHaveBeenCalledWith(customerId);
        expect(mockCustomerAdapter.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when deletion fails', async () => {
        const customerId = 'test-customer-id';
        const error = new Error('Failed to delete customer');
        
        // Mock the delete method to reject with an error
        mockCustomerAdapter.delete.mockRejectedValueOnce(error);

        // Execute and expect the service to throw
        await expect(service.execute(customerId)).rejects.toThrow('Failed to delete customer');
        
        // Verify the adapter's delete method was called
        expect(mockCustomerAdapter.delete).toHaveBeenCalledWith(customerId);
        expect(mockCustomerAdapter.delete).toHaveBeenCalledTimes(1);
    });
});
