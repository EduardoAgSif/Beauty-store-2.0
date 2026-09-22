import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService, UserSession } from '../services/auth.service';
import { AddressService } from '../services/address.service';
import { Address } from '../models/address.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit, OnDestroy {
  user: UserSession | null = null;
  addresses: Address[] = [];
  private addressSub!: Subscription;
  private userSub!: Subscription;

  // Shipping Addresses Modal & Form state
  isAddressModalOpen = false;
  isEditAddressModalOpen = false;
  editingAddressId: string | null = null;

  addressForm = {
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    label: 'Home' as 'Home' | 'Work' | 'Other',
    isDefault: false
  };

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(u => {
      this.user = u;
    });

    this.addressSub = this.addressService.addresses$.subscribe(list => {
      this.addresses = list;
    });
  }

  ngOnDestroy() {
    if (this.addressSub) {
      this.addressSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  async ionViewWillEnter() {
    this.user = await this.authService.getUser();
    await this.addressService.loadAddresses();
  }

  // ==========================================
  // SHIPPING ADDRESS CRUD (PERSISTENT)
  // ==========================================

  openAddressManager() {
    this.isAddressModalOpen = true;
  }

  closeAddressManager() {
    this.isAddressModalOpen = false;
  }

  /**
   * Alta (Create): Open form to add a new address
   */
  openNewAddressForm() {
    this.editingAddressId = null;
    this.addressForm = {
      fullName: this.user?.name || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      label: 'Home',
      isDefault: this.addresses.length === 0
    };
    this.isEditAddressModalOpen = true;
  }

  /**
   * Modificación (Update): Open form with existing address data
   */
  openEditAddressForm(addr: Address) {
    this.editingAddressId = addr.id;
    this.addressForm = {
      fullName: addr.fullName,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      phone: addr.phone,
      label: addr.label || 'Home',
      isDefault: !!addr.isDefault
    };
    this.isEditAddressModalOpen = true;
  }

  closeEditAddressForm() {
    this.isEditAddressModalOpen = false;
    this.editingAddressId = null;
  }

  /**
   * Save Address (Handles both Create and Update)
   */
  async saveAddress() {
    if (
      !this.addressForm.fullName.trim() ||
      !this.addressForm.street.trim() ||
      !this.addressForm.city.trim() ||
      !this.addressForm.postalCode.trim() ||
      !this.addressForm.phone.trim()
    ) {
      this.showToast('Please fill in all required address fields.');
      return;
    }

    if (this.editingAddressId) {
      // Modificación (Update)
      const updated: Address = {
        id: this.editingAddressId,
        fullName: this.addressForm.fullName.trim(),
        street: this.addressForm.street.trim(),
        city: this.addressForm.city.trim(),
        state: this.addressForm.state.trim() || 'DGO',
        postalCode: this.addressForm.postalCode.trim(),
        phone: this.addressForm.phone.trim(),
        label: this.addressForm.label,
        isDefault: this.addressForm.isDefault
      };
      await this.addressService.updateAddress(updated);
      this.showToast('Shipping address updated successfully.');
    } else {
      // Alta (Create)
      await this.addressService.addAddress({
        fullName: this.addressForm.fullName.trim(),
        street: this.addressForm.street.trim(),
        city: this.addressForm.city.trim(),
        state: this.addressForm.state.trim() || 'DGO',
        postalCode: this.addressForm.postalCode.trim(),
        phone: this.addressForm.phone.trim(),
        label: this.addressForm.label,
        isDefault: this.addressForm.isDefault
      });
      this.showToast('New shipping address saved.');
    }

    this.closeEditAddressForm();
  }

  /**
   * Eliminación (Delete): Confirm & delete address
   */
  async confirmDeleteAddress(addr: Address) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Address?',
      message: `Are you sure you want to delete the address "${addr.street}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.addressService.deleteAddress(addr.id);
            this.showToast('Address deleted.');
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Set Default Address
   */
  async setDefaultAddress(addr: Address) {
    await this.addressService.setDefaultAddress(addr.id);
    this.showToast(`Set "${addr.street}" as default shipping address.`);
  }

  // ==========================================
  // AUTH & LOGOUT
  // ==========================================

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out of your Glow Beauty account?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Sign Out',
          role: 'destructive',
          handler: async () => {
            await this.authService.logout();
            this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'back' });
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}
