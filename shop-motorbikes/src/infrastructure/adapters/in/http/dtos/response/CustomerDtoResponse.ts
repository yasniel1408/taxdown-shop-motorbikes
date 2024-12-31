export interface CustomerDtoResponse {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  availableCredit: number;
  createdAt: string;
}