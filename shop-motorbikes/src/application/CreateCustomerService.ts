import { inject, injectable } from "tsyringe";
import { CustomerFactory } from '../domain/CustomerFactory';
import { CustomerDao } from '../infrastructure/adapters/out/dynamodb/dao/CustomerDao';
import { DynamoDBCustomerAdapter } from "../infrastructure/adapters/out/dynamodb/DynamoDBCustomerAdapter";
import { CustomerDtoResponse } from "../infrastructure/adapters/in/http/dtos/response/CustomerDtoResponse";
import { CreateCustomerDtoRequest } from "../infrastructure/adapters/in/http/dtos/request/CreateCustomerDtoRequest";

@injectable()
export class CreateCustomerService {
    constructor(
        @inject("DynamoDBCustomerAdapter")
        private readonly customerdb: DynamoDBCustomerAdapter
    ) {}

    async execute(createCustomerDto: CreateCustomerDtoRequest): Promise<CustomerDtoResponse> {
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
            availableCredit: customerDomain.credit.value,
            createdAt: customerDomain.createdAt
        } as CustomerDao);

        return {
            userId: customerCreated.userId,
            name: customerCreated.name,
            email: customerCreated.email,
            phone: customerCreated.phone,
            availableCredit: customerCreated.availableCredit,
            createdAt: customerCreated.createdAt
        };
    }
}
