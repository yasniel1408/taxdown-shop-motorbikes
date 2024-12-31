export class Credit {
  private readonly _amount: number;

  public constructor(amount: number) {
    if (amount < 0) {
      throw new Error('Credit amount cannot be negative');
    }
    this._amount = amount;
  }

  public add(amount: number): Credit {
    return new Credit(this._amount + amount);
  }

  public get value(): number {
    return this._amount;
  }
}
