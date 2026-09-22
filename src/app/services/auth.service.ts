import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export interface UserSession {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'currentUser';
  private userSubject = new BehaviorSubject<UserSession | null>(null);
  public user$: Observable<UserSession | null> = this.userSubject.asObservable();

  constructor(private storage: StorageService) {
    this.initUser();
  }

  private async initUser() {
    try {
      const stored = await this.storage.get<UserSession>(this.USER_KEY);
      if (stored) {
        this.userSubject.next(stored);
        localStorage.setItem(this.USER_KEY, JSON.stringify(stored));
      } else {
        const local = localStorage.getItem(this.USER_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          this.userSubject.next(parsed);
          await this.storage.set(this.USER_KEY, parsed);
        }
      }
    } catch (e) {
      console.error('AuthService: Error initializing user session', e);
    }
  }

  public async getUser(): Promise<UserSession | null> {
    if (this.userSubject.value) {
      return this.userSubject.value;
    }
    const stored = await this.storage.get<UserSession>(this.USER_KEY);
    if (stored) {
      this.userSubject.next(stored);
      return stored;
    }
    return null;
  }

  public async setUser(user: UserSession): Promise<void> {
    this.userSubject.next(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    await this.storage.set(this.USER_KEY, user);
  }

  public async logout(): Promise<void> {
    this.userSubject.next(null);
    localStorage.removeItem(this.USER_KEY);
    await this.storage.remove(this.USER_KEY);
  }

  public async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return user !== null;
  }
}
