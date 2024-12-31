export class Credit {
  private _amount: number;

  public constructor(amount: number) {
    if (amount < 0) {
      throw new Error('Credit amount cannot be negative');
    }
    this._amount = amount;
  }

  public add(amount: number) {
    this._amount = this._amount + amount;
  }

  public get value(): number {
    return this._amount;
  }
}
