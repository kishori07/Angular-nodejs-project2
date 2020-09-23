import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewbillComponent } from './bills/newbill/newbill.component';
import { SearchComponent } from './bills/search/search.component';


const routes: Routes = [
  {path:'bill',component:NewbillComponent},
  {path:'search',component:SearchComponent},
  {path:'**',redirectTo:'/search',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
