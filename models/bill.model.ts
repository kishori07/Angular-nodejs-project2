import {Item} from './items.model'
export class Bill{

    billno:number;
    items:Item[]=[];
    billAmt:number;

    constructor(public billDate?:string,
                public customerName?:string,
                public contact?:string){}

    addItem(item:Item){
        this.items.push(item);
    }
    getBillAmount(){
        let t=0;
        this.items.forEach(item=>t=t+item.amount);
        this.billAmt=t;
        return t;
    }
}