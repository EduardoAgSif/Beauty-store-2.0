import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoginPage } from './login.page';
import { AuthService } from '../services/auth.service';
import { DataSourceConfigService } from '../services/data-source-config.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: NavController, useValue: { navigateRoot: vi.fn() } },
        { provide: AuthService, useValue: { isAuthenticated: vi.fn().mockResolvedValue(false) } },
        { provide: DataSourceConfigService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
