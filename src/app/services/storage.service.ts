import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /**
   * Save a key-value pair to persistent storage.
   * Serializes objects/arrays to JSON strings.
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await Preferences.set({ key, value: serialized });
    } catch (error) {
      console.error(`StorageService: Error setting key "${key}"`, error);
      throw error;
    }
  }

  /**
   * Retrieve a value from persistent storage by key.
   * Parses JSON strings back into typed objects.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await Preferences.get({ key });
      if (result.value === null || result.value === undefined) {
        return null;
      }
      return JSON.parse(result.value) as T;
    } catch (error) {
      console.error(`StorageService: Error getting key "${key}"`, error);
      return null;
    }
  }

  /**
   * Remove a specific key from persistent storage.
   */
  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`StorageService: Error removing key "${key}"`, error);
      throw error;
    }
  }

  /**
   * Clear all persistent storage data managed by the app.
   */
  async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('StorageService: Error clearing storage', error);
      throw error;
    }
  }
}
