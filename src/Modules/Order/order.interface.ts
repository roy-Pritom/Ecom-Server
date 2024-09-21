export type TOrder={
    id:string;
    name:string;
    address:string;
    contact:string;
    slip?:string;
    note?:string;
    status:'pending' | 'accept' | 'rejected';
    quantity:string;
    sizes?:string[];
    colors?:string[];
    totalPrice:number;
}