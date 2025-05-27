import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor(private platform: Platform) {}

  async abrirRuta(destinoLat: number, destinoLng: number): Promise<void> {
    try {
      let origenLat: number;
      let origenLng: number;

      // Si está en una plataforma nativa (Capacitor Android/iOS)
      if (this.platform.is('capacitor')) {
        const permiso = await Geolocation.requestPermissions();
        if (permiso.location !== 'granted') {
          alert('Permiso de ubicación no concedido.');
          return;
        }

        const position = await Geolocation.getCurrentPosition();
        origenLat = position.coords.latitude;
        origenLng = position.coords.longitude;

      } else {
        // Si está en navegador web
        if ('geolocation' in navigator) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
            });
          });

          origenLat = position.coords.latitude;
          origenLng = position.coords.longitude;

        } else {
          alert('La geolocalización no está soportada en este navegador.');
          return;
        }
      }

      const url = `https://www.google.com/maps/dir/?api=1&origin=${origenLat},${origenLng}&destination=${destinoLat},${destinoLng}&travelmode=driving`;
      window.open(url, '_blank');

    } catch (error: any) {
      console.error('Error al obtener ubicación:', error);
      alert(`No se pudo obtener tu ubicación: ${error.message}`);
    }
  }
}
