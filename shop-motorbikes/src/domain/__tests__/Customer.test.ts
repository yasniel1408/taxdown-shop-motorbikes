import { Customer } from "../entities/Customer";
import { CreditNotNegativeError } from "../errors/CreditNotNegativeError";
import { InvalidCustomerDataError } from "../errors/InvalidCustomerDataError";
import { Credit } from "../value-objects/Credit";

describe('Customer', () => {
  const validCustomerData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    credit: new Credit(1000),
    createdAt: new Date().toISOString()
  };

  describe('constructor validation', () => {
    it('should create a valid customer', () => {
      const customer = new Customer(
        validCustomerData.name,
        validCustomerData.email,
        validCustomerData.phone,
        validCustomerData.credit,
        validCustomerData.createdAt
      );

      expect(customer.name).toBe(validCustomerData.name);
      expect(customer.email).toBe(validCustomerData.email);
      expect(customer.phone).toBe(validCustomerData.phone);
      expect(customer.credit.value).toBe(validCustomerData.credit.value);
      expect(customer.createdAt).toBe(validCustomerData.createdAt);
      expect(customer.id).toBeDefined();
    });

    it('should create a valid customer without phone', () => {
      const customer = new Customer(
        validCustomerData.name,
        validCustomerData.email,
        undefined,
        validCustomerData.credit,
        validCustomerData.createdAt
      );

      expect(customer.phone).toBeUndefined();
    });

    it('should throw error for missing name', () => {
      expect(() => {
        new Customer(
          '',
          validCustomerData.email,
          validCustomerData.phone,
          validCustomerData.credit,
          validCustomerData.createdAt
        );
      }).toThrow(InvalidCustomerDataError);
    });

    it('should throw error for missing email', () => {
      expect(() => {
        new Customer(
          validCustomerData.name,
          '',
          validCustomerData.phone,
          validCustomerData.credit,
          validCustomerData.createdAt
        );
      }).toThrow(InvalidCustomerDataError);
    });

    it('should throw error for invalid email format', () => {
      expect(() => {
        new Customer(
          validCustomerData.name,
          'invalid-email',
          validCustomerData.phone,
          validCustomerData.credit,
          validCustomerData.createdAt
        );
      }).toThrow(InvalidCustomerDataError);
    });

    it('should throw error for invalid phone format', () => {
      expect(() => {
        new Customer(
          validCustomerData.name,
          validCustomerData.email,
          'invalid-phone',
          validCustomerData.credit,
          validCustomerData.createdAt
        );
      }).toThrow(InvalidCustomerDataError);
    });
  });

  describe('credit operations', () => {
    let customer: Customer;

    beforeEach(() => {
      customer = new Customer(
        validCustomerData.name,
        validCustomerData.email,
        validCustomerData.phone,
        new Credit(1000),
        validCustomerData.createdAt
      );
    });

    it('should add credit successfully', () => {
      customer.addCredit(500);
      expect(customer.availableCredit).toBe(1500);
    });

    it('should throw error when adding negative credit', () => {
      expect(() => {
        customer.addCredit(-500);
      }).toThrow(CreditNotNegativeError);
    });

    it('should maintain credit value after multiple operations', () => {
      customer.addCredit(500);
      customer.addCredit(300);
      customer.addCredit(200);
      expect(customer.availableCredit).toBe(2000);
    });
  });

  describe('serialization', () => {
    it('should serialize to JSON correctly', () => {
      const customer = new Customer(
        validCustomerData.name,
        validCustomerData.email,
        validCustomerData.phone,
        validCustomerData.credit,
        validCustomerData.createdAt
      );

      const json = customer.toJSON();

      expect(json).toEqual({
        userId: customer.id,
        name: validCustomerData.name,
        email: validCustomerData.email,
        phone: validCustomerData.phone,
        availableCredit: validCustomerData.credit.value,
        createdAt: validCustomerData.createdAt
      });
    });
  });
});
