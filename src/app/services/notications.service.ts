import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NoticationsService {

  constructor() { }

  async scheduleRepeatingNotificationsForPrueba() {
    const messages = [
      'No te olvides cerrar',
      'Desconectar',
      'Botar la basura en su lugar'
    ];
    const repetitionCount = 6;
    const intervalInSeconds = 10;

    for (let i = 0; i < repetitionCount; i++) {
      const messageIndex = i % messages.length;
      const notificationTime = new Date(Date.now() + i * intervalInSeconds * 1000);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: i + 1,
            title: 'Recordatorio Importante',
            body: messages[messageIndex],
            schedule: {
              at: notificationTime,
              repeats: false
            },
          }
        ]
      });
      console.log(`Scheduled notification ${i + 1} for:`, notificationTime);
    }
    console.log('Scheduled', repetitionCount, 'notifications with', intervalInSeconds, 'second intervals.');
  }

  startPruebaNotifications() {
    this.scheduleRepeatingNotificationsForPrueba();
  }

  async cancelAllNotifications() {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
      console.log('All local notifications cancelled.');
    } else {
      console.log('No local notifications to cancel.');
    }
  }
}