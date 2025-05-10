import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class MapsService {

  async abrirRuta(destinoLat: number, destinoLng: number): Promise<void> {
    try {
      // Solicita permiso y obtiene la posición actual
      const position = await Geolocation.getCurrentPosition();

      const origenLat = position.coords.latitude;
      const origenLng = position.coords.longitude;

      const url = `https://www.google.com/maps/dir/?api=1&origin=${origenLat},${origenLng}&destination=${destinoLat},${destinoLng}&travelmode=driving`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      alert('No se pudo obtener tu ubicación actual. Asegúrate de otorgar los permisos necesarios.');
    }
  }
}
