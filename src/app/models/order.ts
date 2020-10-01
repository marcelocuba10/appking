export interface Order {
    idCustomer?: string;
    nameCustomer?: string;
    idVendor?: string;
    nameVendor?: string;
    total?: number;
    date?: string;
    status?:string;
    observation?: string;
    timestamp?: number;
}
