export class Credit {
  private readonly _amount: number;

  private constructor(amount: number) {
    this._amount = amount;
  }

  public static create(amount: number): Credit {
    if (amount < 0) {
      throw new Error('Credit amount cannot be negative');
    }
    return new Credit(amount);
  }

  public add(amount: number): Credit {
    return Credit.create(this._amount + amount);
  }

  public get value(): number {
    return this._amount;
  }
}
