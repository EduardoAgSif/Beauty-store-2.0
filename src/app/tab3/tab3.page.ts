import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  user: any = null;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  ionViewWillEnter() {
    this.loadUser();
  }

  loadUser() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        this.user = JSON.parse(saved);
      } catch {
        this.user = { name: 'Cliente Glow', email: 'cliente@glowbeauty.com' };
      }
    } else {
      this.user = { name: 'Cliente Glow', email: 'cliente@glowbeauty.com' };
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas salir de tu cuenta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, Salir',
          role: 'destructive',
          handler: () => {
            localStorage.removeItem('currentUser');
            this.user = null;
            this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'back' });
          }
        }
      ]
    });
    await alert.present();
  }
}
