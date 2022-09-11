

interface IAccount {

    id?: any,
    name?: string,
    externalRef?: string,
    iban?: string,
    parent?: any,
    type?: string,
    colorRevert?: boolean,
    reconcilable?: boolean,
    createOrLink?: string,
    root?: boolean,
    subAccounts?: IAccount[]
}

export default IAccount;
