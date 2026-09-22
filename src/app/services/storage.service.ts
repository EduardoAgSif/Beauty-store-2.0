import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /**
   * Save a key-value pair to persistent storage.
   * Serializes objects/arrays to JSON strings.
   * Uses synchronous localStorage for instant 0ms access + native Preferences.
   */
  async set<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    try {
      localStorage.setItem(key, serialized);
    } catch (_) {}

    try {
      await Preferences.set({ key, value: serialized });
    } catch (error) {
      console.warn(`StorageService: Native Preferences.set warning for "${key}", using local fallback`, error);
    }
  }

  /**
   * Retrieve a value from persistent storage by key.
   * Checks synchronous localStorage first for instant 0ms response.
   */
  async get<T>(key: string): Promise<T | null> {
    // 1. Instant check in localStorage
    try {
      const localVal = localStorage.getItem(key);
      if (localVal !== null && localVal !== undefined) {
        return JSON.parse(localVal) as T;
      }
    } catch (_) {}

    // 2. Fallback to native Preferences
    try {
      const result = await Preferences.get({ key });
      if (result.value !== null && result.value !== undefined) {
        try {
          localStorage.setItem(key, result.value);
        } catch (_) {}
        return JSON.parse(result.value) as T;
      }
      return null;
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
      localStorage.removeItem(key);
    } catch (_) {}

    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`StorageService: Error removing key "${key}"`, error);
    }
  }

  /**
   * Clear all persistent storage data managed by the app.
   */
  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (_) {}

    try {
      await Preferences.clear();
    } catch (error) {
      console.error('StorageService: Error clearing storage', error);
    }
  }
}
