import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { DataSourcePageRoutingModule } from './data-source-routing.module';
import { DataSourcePage } from './data-source.page';
import { SharedModule } from '../shared/shared.module';
@NgModule({ imports: [CommonModule, FormsModule, IonicModule, SharedModule, DataSourcePageRoutingModule], declarations: [DataSourcePage] })
export class DataSourcePageModule {}
