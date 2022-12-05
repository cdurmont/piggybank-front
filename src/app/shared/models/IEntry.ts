interface IEntry {
    id?: any,
    date?: Date,
    account?: any,
    transaction?: any,
    credit?: number,
    debit?: number,
    reference?: string,
    description?: string,
    contreparties?: IEntry[],
    contrepartieAccountName?: string,
    expanded?: boolean,
    balance?: number,
}

export default IEntry;
