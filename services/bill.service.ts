import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Bill} from '../models/bill.model';
import {Item} from '../models/items.model';
import {map} from 'rxjs/operators';
@Injectable({
    providedIn:'root'
})
export class BillService {

    constructor(private httpClient:HttpClient){}
    private baseUrl="http://localhost:3000/";
    private billUrl=this.baseUrl + "bill";

    saveBill(bill:Bill):Observable<{status:string,message:any}>{
        console.log("service");
        return this.httpClient.post<{status:string,message:any}>(this.billUrl,bill);
    }
 
    search(billNo:number):Observable<Bill>{
        return this.httpClient.get<any>(this.billUrl + `/${billNo}`).pipe(
            map(response=>{
                console.log(response);
                if(response.status=='SUCCESS'){
                    const data=response.data;
                    const bill:Bill=new Bill();
                    bill.billno=data.billno;
                    bill.customerName=data.customerName;
                    bill.billDate=data.billDate;
                    bill.billAmt=data.billAmt;

                    for (let e of data.items){
                        const item=new Item(e.itemNo,e.name,e.price,e.qty);
                        bill.addItem(item);
                    }
                    return bill;

                }
                else{
return null;
                }
            })
        
        )
    }
}