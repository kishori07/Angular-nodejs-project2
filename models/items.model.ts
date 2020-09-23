export class Item{

    constructor(private itemNo:number,
                private name:string,
                private price:number,
                private qty:number){}


get amount(){
return this.price*this.qty;
}
}