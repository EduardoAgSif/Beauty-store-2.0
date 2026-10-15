import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataSourcePage } from './data-source.page';
const routes: Routes = [{ path: '', component: DataSourcePage }];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class DataSourcePageRoutingModule {}
