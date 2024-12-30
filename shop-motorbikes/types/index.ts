export interface Customer {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  availableCredit: number;
  createdAt: string;
}

export interface CustomerInput {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  availableCredit?: number;
}

export interface CreditInput {
  amount: number;
}
