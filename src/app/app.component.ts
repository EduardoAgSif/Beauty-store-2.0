import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataSourceConfigService, RequestDiagnostics } from './services/data-source-config.service';
import { addIcons } from 'ionicons';
import {
  // Social / misc (already present)
  logoFacebook,
  logoGoogle,
  logoTwitter,
  // Diagnostics
  codeSlashOutline,
  refreshOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  checkmarkCircle,
  // Auth / profile
  logOutOutline,
  personCircleOutline,
  person,
  personOutline,
  // Network status bar
  syncOutline,
  cloudOfflineOutline,
  wifiOutline,
  // Navigation / tabs
  homeOutline,
  cartOutline,
  // Product catalog
  sparkles,
  sparklesOutline,
  star,
  starOutline,
  bagHandleOutline,
  bagCheckOutline,
  searchOutline,
  closeCircle,
  close,
  // Cart / checkout
  airplaneOutline,
  trashOutline,
  removeOutline,
  addOutline,
  addCircleOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  // Account / addresses
  locationOutline,
  cardOutline,
  pricetagOutline,
  helpBuoyOutline,
  chevronForwardOutline,
  createOutline,
  callOutline,
  saveOutline,
  // ionic shapes (legacy)
  triangle,
  ellipse,
  square,
  // refresher
  chevronDownCircleOutline,
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
      // Social
      'logo-facebook': logoFacebook,
      'logo-google': logoGoogle,
      'logo-twitter': logoTwitter,
      // Diagnostics
      'code-slash-outline': codeSlashOutline,
      'refresh-outline': refreshOutline,
      'alert-circle-outline': alertCircleOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'checkmark-circle': checkmarkCircle,
      // Auth / profile
      'log-out-outline': logOutOutline,
      'person-circle-outline': personCircleOutline,
      'person': person,
      'person-outline': personOutline,
      // Network status bar
      'sync-outline': syncOutline,
      'cloud-offline-outline': cloudOfflineOutline,
      'wifi-outline': wifiOutline,
      // Navigation / tabs
      'home-outline': homeOutline,
      'cart-outline': cartOutline,
      // Product catalog
      'sparkles': sparkles,
      'sparkles-outline': sparklesOutline,
      'star': star,
      'star-outline': starOutline,
      'bag-handle-outline': bagHandleOutline,
      'bag-check-outline': bagCheckOutline,
      'search-outline': searchOutline,
      'close-circle': closeCircle,
      'close': close,
      // Cart / checkout
      'airplane-outline': airplaneOutline,
      'trash-outline': trashOutline,
      'remove-outline': removeOutline,
      'add-outline': addOutline,
      'add-circle-outline': addCircleOutline,
      'lock-closed-outline': lockClosedOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      // Account / addresses
      'location-outline': locationOutline,
      'card-outline': cardOutline,
      'pricetag-outline': pricetagOutline,
      'help-buoy-outline': helpBuoyOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'create-outline': createOutline,
      'call-outline': callOutline,
      'save-outline': saveOutline,
      // ionic shapes (legacy)
      triangle,
      ellipse,
      square,
      // refresher
      'chevron-down-circle-outline': chevronDownCircleOutline,
    });
  }

  closeDiagnostics(): void { this.configService.closeDiagnostics(); }
  ngOnDestroy(): void { this.diagnosticsSubscription?.unsubscribe(); }
}
