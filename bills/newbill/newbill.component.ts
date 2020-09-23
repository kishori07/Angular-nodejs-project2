import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { BillService } from 'src/app/services/bill.service';
import { Bill } from 'src/app/models/bill.model';
import { Item } from 'src/app/models/items.model';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-newbill',
  templateUrl: './newbill.component.html',
  styleUrls: ['./newbill.component.css']
})
export class NewbillComponent implements OnInit {

  billForm: FormGroup;
  items: FormArray;
  error=undefined;
  billGenerated=false;
  bill=undefined;

  constructor(private billservice: BillService) { }

  ngOnInit(): void {
    this.billGenerated=false;
    
    this.error=undefined;
    
    this.items = new FormArray([]);
    this.billForm = new FormGroup({
      billDate: new FormControl(new Date()),
      customerName: new FormControl(),
      contact: new FormControl(),
      items: this.items,
    });
    this.addItem();
  }

  addItem() {
    this.items.push(new FormGroup({
      name: new FormControl(),
      price: new FormControl(0),
      qty: new FormControl(0),
      amount: new FormControl(0)
    }));
  }

  getBillAmount() {
    let t = 0;
    this.items.controls.forEach(item => {
      t += item.get('amount').value;
    });
    return t;
  }

  calcAmt(item: FormGroup) {
    item.get('amount').setValue(item.get('price').value * item.get('qty').value);
  }

  onSubmit() {
  
    console.log("billForm=" + this.billForm.value);

    let bill: Bill = new Bill(this.dateToString(this.billForm.get('billDate').value),
      this.billForm.get('customerName').value,
      this.billForm.get('contact').value)

    this.items.controls.forEach((item, index) => {
      const i = new Item(index + 1, item.get("name").value, item.get('price').value, item.get('qty').value);
      bill.addItem(i);

    });
    console.log("Bill=" + JSON.stringify(bill));
    console.log("Amount=" + bill.getBillAmount());
    
    this.billservice.saveBill(bill).subscribe(response => {
      if(response.status=='SUCCESS'){
        console.log(response);        
        bill.billno=response.message.billno;
        console.log(bill.billno);
        this.billGenerated=true;
        this.bill=bill;
      }else{
        this.error=response.message;
      }
    })

  }

  dateToString(date: Date) {
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  }

  printBill(){
    window.print();
    this.ngOnInit();
  }
}
