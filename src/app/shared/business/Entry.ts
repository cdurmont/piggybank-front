import IEntry from "../models/IEntry";

/**
 * Utility class for manipulating entries
 */
export class Entry {


  static creditDebit(entry: IEntry): number {
    return this.getDebit(entry) - this.getCredit(entry);
  }

  static add(entry: IEntry, added: IEntry) {
    entry.credit = this.getCredit(entry) + this.getCredit(added);
    entry.debit = this.getDebit(entry) + this.getDebit(added);
  }

  static isZero(entry: IEntry): boolean {
    return Math.abs(this.getDebit(entry) - this.getCredit(entry)) < 0.01;
  }

  static getCredit(entry:IEntry):number {
    return entry.credit ? entry.credit : 0;
  }
  static getDebit(entry:IEntry):number {
    return entry.debit ? entry.debit : 0;
  }
}
