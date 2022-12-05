import IEntry from "./IEntry";
import IUser from "./IUser";
import IAssociation from "./IAssociation";


interface ITransaction {
    id?: any,
    balanced?: boolean,
    type?: string,
    description?: string,
    recurStartDate?: Date,
    recurEndDate?: Date,
    recurNextDate?: Date,
    owner?: IUser,
    entries?: IEntry[],
    reconciled?: boolean,
    selected?: boolean,
    assignDialogVisible?: boolean,
    appliedAssociation?: IAssociation,
}

export default ITransaction;
