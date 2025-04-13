export interface IPriceDisplayEntity {
    price: number;
    updatedAt: Date;
}

export class PriceDisplayEntity implements IPriceDisplayEntity {
    price: number;
    updatedAt: Date;

    constructor(data: Readonly<Pick<IPriceDisplayEntity, 'price'>>) {
        this.price = data.price;
        this.updatedAt = new Date();
    }
}
