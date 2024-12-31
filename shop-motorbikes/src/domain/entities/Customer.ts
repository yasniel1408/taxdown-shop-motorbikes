import { Credit } from '../value-objects/Credit';
import { v4 as uuidv4 } from 'uuid';

export class Customer {
  private _id = uuidv4();

  constructor(
    private readonly _name: string,
    private readonly _email: string,
    private readonly _phone: string | undefined,
    private _credit: Credit,
    private readonly _createdAt: string
  ) {}

  public addCredit(amount: number): void {
    this._credit.add(amount);
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

  public get credit(): Credit {
    return this._credit;
  }

  public get availableCredit(): number {
    return this._credit.value;
  }

  public get createdAt(): string {
    return this._createdAt;
  }

  public set id(id: string) {
    this._id = id;
  }

  public toJSON() {
    return {
      userId: this._id,
      name: this._name,
      email: this._email,
      phone: this._phone,
      availableCredit: this._credit.value,
      createdAt: this._createdAt
    };
  }
}
