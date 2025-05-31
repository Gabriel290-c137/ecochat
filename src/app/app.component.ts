import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NoticationsService } from './services/notications.service';
import { NoticationsPushService } from './services/notificacionespush.service';
import { ThemeService } from './services/theme.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private notificationsService: NoticationsService,
    private noticationsPushService: NoticationsPushService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.init();
    this.themeService.initializeTheme();
    this.detectSafeAreaSupport(); // 👈 AÑADIDO
  }

  init() {
    if (Capacitor.isNativePlatform()) {
      this.notificationsService.startPruebaNotifications();
      this.noticationsPushService.init();
      this.themeService.initializeTheme();
    } else {
      console.log('No es una plataforma nativa, las notificaciones locales no se iniciarán.');
    }
  }

  // 👇 NUEVA FUNCIÓN
  detectSafeAreaSupport() {
    const topInset = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-top');

    if (topInset && parseInt(topInset) > 0) {
      document.body.classList.add('with-safe-area');
    } else {
      document.body.classList.add('no-safe-area');
    }
  }
}
