import { CustomerFactory } from '../CustomerFactory';
import { Customer } from '../entities/Customer';

describe('CustomerFactory', () => {
    it('should create a customer with all required fields', () => {
        // Arrange
        const name = 'John Doe';
        const email = 'john@example.com';
        const phone = '+1234567890';
        const initialCredit = 1000;

        // Act
        const customer = CustomerFactory.create(name, email, phone, initialCredit);

        // Assert
        expect(customer).toBeInstanceOf(Customer);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
        expect(customer.phone).toBe(phone);
        expect(customer.availableCredit).toBe(initialCredit);
        expect(customer.createdAt).toBeDefined();
        expect(customer.id).toBeDefined();
    });

    it('should create a customer without phone number', () => {
        // Arrange
        const name = 'John Doe';
        const email = 'john@example.com';
        const initialCredit = 1000;

        // Act
        const customer = CustomerFactory.create(name, email, undefined, initialCredit);

        // Assert
        expect(customer).toBeInstanceOf(Customer);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
        expect(customer.phone).toBeUndefined();
        expect(customer.availableCredit).toBe(initialCredit);
    });

    it('should create a customer with zero initial credit', () => {
        // Arrange
        const name = 'John Doe';
        const email = 'john@example.com';
        const initialCredit = 0;

        // Act
        const customer = CustomerFactory.create(name, email, undefined, initialCredit);

        // Assert
        expect(customer.availableCredit).toBe(0);
    });

    it('should throw error when creating customer with negative credit', () => {
        // Arrange
        const name = 'John Doe';
        const email = 'john@example.com';
        const initialCredit = -100;

        // Act & Assert
        expect(() => {
            CustomerFactory.create(name, email, undefined, initialCredit);
        }).toThrow('Credit amount cannot be negative');
    });

    it('should create a customer with a unique ID', () => {
        // Arrange
        const name = 'John Doe';
        const email = 'john@example.com';
        const initialCredit = 1000;

        // Act
        const customer1 = CustomerFactory.create(name, email, undefined, initialCredit);
        const customer2 = CustomerFactory.create(name, email, undefined, initialCredit);

        // Assert
        expect(customer1.id).toBeDefined();
        expect(customer2.id).toBeDefined();
        expect(customer1.id).not.toBe(customer2.id);
    });
});
