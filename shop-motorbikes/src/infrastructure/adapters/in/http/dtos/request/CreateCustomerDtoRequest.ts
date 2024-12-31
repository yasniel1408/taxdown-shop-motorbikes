export interface CreateCustomerDtoRequest {
  name: string;
  email: string;
  phone?: string;
  availableCredit: number;
}