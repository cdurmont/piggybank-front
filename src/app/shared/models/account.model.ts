import IAccount from "./IAccount";

export interface Account {
  accountId: string;
  name: string;
  mask: string; // partial bank account number
  piggyAccountId?: number|null;
  syncCursor?: string;
  syncStartDate?: Date;
  piggyAccount?: IAccount;
}
