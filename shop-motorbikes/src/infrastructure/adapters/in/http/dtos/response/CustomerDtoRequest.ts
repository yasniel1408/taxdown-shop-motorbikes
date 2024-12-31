export interface CustomerDtoRequest {
  userId: string;
  name: string;
  email: string;
  phone: string | undefined;
  availableCredit: number;
  createdAt: string;
}