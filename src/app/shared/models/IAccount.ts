import IStat from "./IStat";


interface IAccount {

    id?: any,
    name?: string,
    externalRef?: string,
    linkId?: string | null,
    iban?: string,
    parent?: any,
    type?: string,
    colorRevert?: boolean,
    reconcilable?: boolean,
    createOrLink?: string,
    root?: boolean,
    icon?: string,
    color?: string,
    subAccounts?: IAccount[],
    stats?: IStat[]
}

export default IAccount;
