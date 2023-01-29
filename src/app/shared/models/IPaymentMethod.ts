import IUser from "./IUser";
import IAccount from "./IAccount";

interface IPaymentMethod {
  id?: number,
  instance?: any,
  user?: IUser,
  account?: IAccount,
  name?: string
}

export default IPaymentMethod;
