import { Customer } from "./entities/Customer";
import { Credit } from "./value-objects/Credit";

export class CustomerFactory {
    public static create(
        name: string,
        email: string,
        phone?: string,
        initialCredit: number = 0
      ): Customer {
        return new Customer(
          name,
          email,
          phone,
          new Credit(initialCredit),
          new Date().toString()
        );
      }
}