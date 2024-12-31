import { injectable, inject } from "tsyringe";
import { CustomerDatabasePort } from "../domain/ports/out/CustomerDatabasePort";
import { CustomerDao } from "../infrastructure/adapters/out/dynamodb/dao/CustomerDao";
import { CustomerDtoResponse } from "../infrastructure/adapters/in/http/dtos/response/CustomerDtoResponse";

@injectable()
export class GetAllCustomersService {
  constructor(
    @inject("DynamoDBCustomerAdapter")
    private readonly customerdb: CustomerDatabasePort<CustomerDao>
  ) {}

  async execute(sortByCredit: boolean = false): Promise<CustomerDtoResponse[]> {
    const customers = sortByCredit
      ? await this.customerdb.findAllSortedByCredit()
      : await this.customerdb.findAll();

    return customers.map((customer) => ({
      userId: customer.userId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      availableCredit: customer.availableCredit,
      createdAt: customer.createdAt
    }));
  }
}
