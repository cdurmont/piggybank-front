

interface IAccount {

    _id?: any,
    name?: string,
    externalRef?: string,
    iban?: string,
    parent?: any,
    type?: string,
    colorRevert?: boolean,
    createOrLink?: string,
}

export default IAccount;
