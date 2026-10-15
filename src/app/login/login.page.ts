import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { DataSourceConfigService, RequestDiagnostics } from '../services/data-source-config.service';

@Component({ selector: 'app-login', templateUrl: './login.page.html', styleUrls: ['./login.page.scss'], standalone: false })
export class LoginPage implements OnInit {
  isSignUpMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  lastDiagnostics: RequestDiagnostics | null = null;
  showDiagnostics = false;
  signInData = { email: 'test@gmail.com', password: 'admin1234' };
  signUpData = { name: '', email: '', password: '' };

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private configService: DataSourceConfigService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  async ionViewWillEnter(): Promise<void> {
    this.isLoading = false; this.errorMessage = ''; this.successMessage = '';
    this.cdr.detectChanges();
    if (await this.authService.isAuthenticated()) this.ngZone.run(() => this.navCtrl.navigateRoot('/tabs/tab1'));
  }

  toggleMode(signUpState?: boolean): void {
    this.errorMessage = ''; this.successMessage = '';
    this.isSignUpMode = signUpState !== undefined ? signUpState : !this.isSignUpMode;
    this.resetForms(); this.cdr.detectChanges();
  }

  resetForms(): void {
    this.signInData = { email: 'test@gmail.com', password: 'admin1234' };
    this.signUpData = { name: '', email: '', password: '' };
  }

  async quickDemoLogin(): Promise<void> {
    this.signInData.email = 'test@gmail.com'; this.signInData.password = 'admin1234';
    await this.onSignIn();
  }

  openDiagnostics(): void { if (this.lastDiagnostics) this.configService.openDiagnostics(this.lastDiagnostics); else this.showDiagnostics = true; }

  async onSignIn(): Promise<void> {
    this.errorMessage = ''; this.successMessage = '';
    if (!this.signInData.email || !this.signInData.password) {
      this.errorMessage = 'Please enter your email and password.'; this.cdr.detectChanges(); return;
    }
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
    const url = await this.configService.getEndpoint('login.php');
    const requestPayload = { email: this.signInData.email, password: this.signInData.password };
    try {
      const result = await this.configService.request<any>('POST', url, requestPayload, headers);
      const diagnostics = result.diagnostics;
      diagnostics.payload = { email: this.signInData.email, password: '[REDACTED]' };
      this.lastDiagnostics = diagnostics;
      const data = result.data;
      this.ngZone.run(async () => {
        this.isLoading = false;
        if (data?.status === 'success' && data.user) {
          await this.authService.setUser(data.user);
          this.successMessage = 'Login successful! Welcome back.'; this.cdr.detectChanges();
          setTimeout(() => this.navCtrl.navigateRoot('/tabs/tab1'), 300);
        } else {
          diagnostics.response = this.configService.safeResponse(data);
          diagnostics.error = data?.message || 'API returned a response that did not authenticate the user.';
          this.errorMessage = data?.message || 'Invalid email or password.';
          this.lastDiagnostics = diagnostics;
          this.configService.openDiagnostics(diagnostics);
          this.cdr.detectChanges();
        }
      });
    } catch (error: any) {
      const diagnostics = error?.requestDiagnostics as RequestDiagnostics | undefined;
      if (diagnostics) {
        diagnostics.payload = { email: this.signInData.email, password: '[REDACTED]' };
        this.lastDiagnostics = diagnostics;
      }
      this.ngZone.run(() => {
        this.isLoading = false;
        this.errorMessage = error?.response?.data?.message || 'No se pudo completar la solicitud. Revisa el diagnóstico técnico.';
        this.cdr.detectChanges();
      });
    }
  }

  async onSignUp(): Promise<void> {
    this.errorMessage = ''; this.successMessage = '';
    if (!this.signUpData.name || !this.signUpData.email || !this.signUpData.password) {
      this.errorMessage = 'Please complete all fields to sign up.'; this.cdr.detectChanges(); return;
    }
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
    const url = await this.configService.getEndpoint('signup.php');
    const requestPayload = { name: this.signUpData.name, email: this.signUpData.email, password: this.signUpData.password };
    try {
      const result = await this.configService.request<any>('POST', url, requestPayload, headers);
      const diagnostics = result.diagnostics;
      diagnostics.payload = { name: this.signUpData.name, email: this.signUpData.email, password: '[REDACTED]' };
      this.lastDiagnostics = diagnostics;
      this.ngZone.run(() => {
        this.isLoading = false;
        if (result.data?.status === 'success') {
          this.successMessage = 'Account created successfully! Please sign in.'; this.cdr.detectChanges();
          setTimeout(() => this.toggleMode(false), 1500);
        } else {
          diagnostics.response = this.configService.safeResponse(result.data);
          diagnostics.error = result.data?.message || 'API returned an unsuccessful signup response.';
          this.errorMessage = result.data?.message || 'Error creating account.';
          this.configService.openDiagnostics(diagnostics);
          this.cdr.detectChanges();
        }
      });
    } catch (error: any) {
      const diagnostics = error?.requestDiagnostics as RequestDiagnostics | undefined;
      if (diagnostics) {
        diagnostics.payload = { name: this.signUpData.name, email: this.signUpData.email, password: '[REDACTED]' };
        this.lastDiagnostics = diagnostics;
      }
      this.ngZone.run(() => {
        this.isLoading = false;
        this.errorMessage = error?.response?.data?.message || 'No se pudo completar la solicitud. Revisa el diagnóstico técnico.';
        this.cdr.detectChanges();
      });
    }
  }

}

