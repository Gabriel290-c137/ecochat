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
  }

  init() {
    if (Capacitor.isNativePlatform()) {
      // Inicializa las notificaciones push (si aún las necesitas para otras funcionalidades)
      // this.notificationsService.initPush();

      // Inicia las notificaciones locales repetitivas para la fase de prueba
      this.notificationsService.startPruebaNotifications();
      this.noticationsPushService.init();
      this.themeService.initializeTheme();
      // Si necesitas iniciar las notificaciones reales en algún punto (no al inicio),
      // puedes tener otra función o lógica para eso.
      // Por ejemplo:
      // setTimeout(() => {
      //   this.notificationsService.startRealNotifications();
      // }, 5000); // Iniciar después de 5 segundos
    } else {
      console.log('No es una plataforma nativa, las notificaciones locales no se iniciarán.');
    }
  }
}