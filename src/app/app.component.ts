import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataSourceConfigService, RequestDiagnostics } from './services/data-source-config.service';
import { addIcons } from 'ionicons';
import { 
  logoFacebook, 
  logoGoogle, 
  logoTwitter, 
  codeSlashOutline,
  refreshOutline,
  alertCircleOutline, 
  checkmarkCircleOutline, 
  logOutOutline, 
  personCircleOutline, 
  triangle, 
  ellipse, 
  square 
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnDestroy {
  private readonly configService = inject(DataSourceConfigService);
  diagnosticsVisible = false;
  diagnosticsDetails: RequestDiagnostics | null = null;
  private diagnosticsSubscription: Subscription;

  constructor() {
    this.diagnosticsSubscription = this.configService.diagnostics$.subscribe(state => {
      this.diagnosticsVisible = state.visible;
      this.diagnosticsDetails = state.details;
    });
    addIcons({
      'logo-facebook': logoFacebook,
      'logo-google': logoGoogle,
      'logo-twitter': logoTwitter,
      'code-slash-outline': codeSlashOutline,
      'refresh-outline': refreshOutline,
      'alert-circle-outline': alertCircleOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'log-out-outline': logOutOutline,
      'person-circle-outline': personCircleOutline,
      triangle,
      ellipse,
      square
    });
  }

  closeDiagnostics(): void { this.configService.closeDiagnostics(); }
  ngOnDestroy(): void { this.diagnosticsSubscription?.unsubscribe(); }
}
