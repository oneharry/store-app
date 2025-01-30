export interface IProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export type ProductUpdate = Partial<IProduct>;

export type ProductResponse = IProduct;
