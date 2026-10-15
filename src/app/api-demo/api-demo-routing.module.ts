import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiDemoPage } from './api-demo.page';

const routes: Routes = [{ path: '', component: ApiDemoPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiDemoPageRoutingModule {}
