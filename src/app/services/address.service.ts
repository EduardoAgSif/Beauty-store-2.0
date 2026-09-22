import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from '../models/address.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly STORAGE_KEY = 'glow_beauty_addresses';
  private addressesSubject = new BehaviorSubject<Address[]>([]);
  public addresses$: Observable<Address[]> = this.addressesSubject.asObservable();
  private isLoaded = false;

  constructor(private storage: StorageService) {
    this.loadAddresses();
  }

  /**
   * Load addresses from persistent storage.
   * If storage is empty, initialize with a sample address.
   */
  public async loadAddresses(): Promise<Address[]> {
    try {
      const stored = await this.storage.get<Address[]>(this.STORAGE_KEY);
      if (stored && Array.isArray(stored) && stored.length > 0) {
        this.addressesSubject.next(stored);
      } else {
        const initialSeed: Address[] = [
          {
            id: 'addr_' + Date.now(),
            fullName: 'Eduardo Aguilar',
            street: 'Av. Paseo de las Lomas #450, Apt 3B',
            city: 'Durango',
            state: 'DGO',
            postalCode: '34100',
            phone: '+52 618 123 4567',
            label: 'Home',
            isDefault: true,
            createdAt: new Date().toISOString()
          }
        ];
        await this.storage.set(this.STORAGE_KEY, initialSeed);
        this.addressesSubject.next(initialSeed);
      }
      this.isLoaded = true;
      return this.addressesSubject.value;
    } catch (error) {
      console.error('AddressService: Error loading addresses from persistent storage', error);
      return [];
    }
  }

  /**
   * Consulta (Read): Get current list of addresses synchronously or reload.
   */
  public getAddresses(): Address[] {
    return this.addressesSubject.value;
  }

  /**
   * Alta (Create): Add a new address to persistent storage.
   */
  public async addAddress(data: Omit<Address, 'id' | 'createdAt'>): Promise<Address> {
    const current = [...this.addressesSubject.value];
    const newId = 'addr_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const isFirst = current.length === 0;

    const newAddress: Address = {
      ...data,
      id: newId,
      isDefault: data.isDefault || isFirst,
      createdAt: new Date().toISOString()
    };

    if (newAddress.isDefault) {
      // Unset previous defaults
      for (const addr of current) {
        addr.isDefault = false;
      }
    }

    current.unshift(newAddress);
    await this.persist(current);
    return newAddress;
  }

  /**
   * Modificación (Update): Update an existing address in persistent storage.
   */
  public async updateAddress(updated: Address): Promise<Address> {
    let current = [...this.addressesSubject.value];
    const index = current.findIndex(a => a.id === updated.id);

    if (index === -1) {
      throw new Error(`Address with ID ${updated.id} not found.`);
    }

    if (updated.isDefault) {
      current = current.map(a => ({
        ...a,
        isDefault: a.id === updated.id
      }));
    }

    current[index] = { ...updated };
    await this.persist(current);
    return updated;
  }

  /**
   * Eliminación (Delete): Remove an address from persistent storage.
   */
  public async deleteAddress(id: string): Promise<void> {
    let current = this.addressesSubject.value.filter(a => a.id !== id);
    // If the deleted address was default and other addresses exist, make the first one default
    if (current.length > 0 && !current.some(a => a.isDefault)) {
      current[0].isDefault = true;
    }
    await this.persist(current);
  }

  /**
   * Set an address as default.
   */
  public async setDefaultAddress(id: string): Promise<void> {
    const current = this.addressesSubject.value.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    await this.persist(current);
  }

  private async persist(addresses: Address[]): Promise<void> {
    this.addressesSubject.next(addresses);
    await this.storage.set(this.STORAGE_KEY, addresses);
  }
}
