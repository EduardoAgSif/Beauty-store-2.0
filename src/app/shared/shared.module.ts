import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { RequestDiagnosticsComponent } from './request-diagnostics/request-diagnostics.component';
@NgModule({ imports: [CommonModule, IonicModule], declarations: [RequestDiagnosticsComponent], exports: [RequestDiagnosticsComponent] })
export class SharedModule {}
