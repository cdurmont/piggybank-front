import { Account } from './account.model';

export interface Connection {
  userId: string;
  itemId: string;
  accessToken?: string;

  bankId?: string;
  bankName?: string;
  primaryColor?: string;

  accounts?: Account[];
}
