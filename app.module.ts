import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewbillComponent } from './bills/newbill/newbill.component';

import {BillService} from './services/bill.service';
import {ReactiveFormsModule} from '@angular/forms';
import{HttpClientModule} from '@angular/common/http';
import { ReceiptComponent } from './bills/receipt/receipt.component';
import { SearchComponent } from './bills/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    NewbillComponent,
    ReceiptComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [BillService],
  bootstrap: [AppComponent]
})
export class AppModule { }
