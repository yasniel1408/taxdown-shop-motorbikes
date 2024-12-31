import { inject, injectable } from "tsyringe";
import { Customer } from "../domain/entities/Customer";
import { CustomerFactory } from '../domain/CustomerFactory';
import { CustomerDtoRequest } from '../infrastructure/adapters/in/http/dtos/response/CustomerDtoRequest';
import { CreateCustomerDtoResponse } from '../infrastructure/adapters/in/http/dtos/request/CreateCustomerDtoResponse';
import { CustomerDao } from '../infrastructure/adapters/out/dynamodb/dao/CustomerDao';
import { CustomerDatabasePort } from "../domain/ports/out/CustomerDatabasePort";

@injectable()
export class CreateCustomerService {
    constructor(
        @inject("CustomerDatabasePort")
        private readonly customerdb: CustomerDatabasePort<CustomerDao>
    ) {}

    async execute(createCustomerDto: CreateCustomerDtoResponse): Promise<CustomerDtoRequest> {
        const customerDomain = CustomerFactory.create(
            createCustomerDto.name,
            createCustomerDto.email,
            createCustomerDto.phone,
            createCustomerDto.availableCredit
        );

        const customerCreated = await this.customerdb.save({
            userId: customerDomain.id,
            name: customerDomain.name,
            email: customerDomain.email,
            phone: customerDomain.phone,
            availableCredit: customerDomain.credit,
            createdAt: customerDomain.createdAt
        } as CustomerDao);

        return {
            userId: customerCreated.userId,
            name: customerCreated.name,
            email: customerCreated.email,
            phone: customerCreated.phone,
            availableCredit: customerCreated.availableCredit,
            createdAt: customerCreated.createdAt.toISOString()
        };
    }
}
