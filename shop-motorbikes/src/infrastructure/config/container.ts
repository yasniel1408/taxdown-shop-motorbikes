import "reflect-metadata";
import { container } from "tsyringe";
import { DynamoDBCustomerAdapter } from "../adapters/out/dynamodb/DynamoDBCustomerAdapter";
import { CreateCustomerService } from "../../application/CreateCustomerService";
import { GetCustomerByIdService } from "../../application/GetCustomerByIdService";
import { UpdateCustomerService } from "../../application/UpdateCustomerService";
import { DeleteCustomerService } from "../../application/DeleteCustomerService";
import { AddCreditToCustomerService } from "../../application/AddCreditToCustomerService";
import { GetAllCustomersService } from "../../application/GetAllCustomersService";
import { CustomerHttpControllerAdapter } from "../adapters/in/http/CustomerHttpControllerAdapter";

// Register repository
container.registerSingleton<DynamoDBCustomerAdapter>(
  "DynamoDBCustomerAdapter",
  DynamoDBCustomerAdapter
);

// Register services
container.registerSingleton<CreateCustomerService>("CreateCustomerService", CreateCustomerService);
container.registerSingleton<GetCustomerByIdService>("GetCustomerByIdService", GetCustomerByIdService);
container.registerSingleton<UpdateCustomerService>("UpdateCustomerService", UpdateCustomerService);
container.registerSingleton<DeleteCustomerService>("DeleteCustomerService", DeleteCustomerService);
container.registerSingleton<AddCreditToCustomerService>("AddCreditToCustomerService", AddCreditToCustomerService);
container.registerSingleton<GetAllCustomersService>("GetAllCustomersService", GetAllCustomersService);

// Register controller
container.registerSingleton<CustomerHttpControllerAdapter>("CustomerInputPort", CustomerHttpControllerAdapter);

export { container };
