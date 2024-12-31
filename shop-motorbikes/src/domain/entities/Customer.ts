import { Credit } from '../value-objects/Credit';

export class Customer {
  private readonly _id = crypto.randomUUID();

  constructor(
    private readonly _name: string,
    private readonly _email: string,
    private readonly _phone: string | undefined,
    private _credit: Credit,
    private readonly _createdAt: Date
  ) {}

  public addCredit(amount: number): void {
    this._credit = this._credit.add(amount);
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }

  public get phone(): string | undefined {
    return this._phone;
  }

  public get credit(): number {
    return this._credit.value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public toJSON() {
    return {
      userId: this._id,
      name: this._name,
      email: this._email,
      phone: this._phone,
      availableCredit: this._credit.value,
      createdAt: this._createdAt.toISOString()
    };
  }
}
