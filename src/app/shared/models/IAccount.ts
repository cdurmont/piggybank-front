

interface IAccount {

    _id?: any,
    name?: string,
    externalRef?: string,
    iban?: string,
    parent?: any,
    type?: string,
    createOrLink?: string;
}

export default IAccount;
