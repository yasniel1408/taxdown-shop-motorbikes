export interface CustomerDao {
  userId: string;
  name: string;
  email: string;
  phone: string | undefined;
  availableCredit: number;
  createdAt: Date;
}
