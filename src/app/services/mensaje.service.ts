import { Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor() {}

  agruparPorFecha(mensajes: Array<{ date: Date | Timestamp }>) {
    const grupos: { [key: string]: any[] } = {};

    for (const mensaje of mensajes) {
      // Convertir Timestamp a Date si es necesario
      const fechaObj = (mensaje.date instanceof Timestamp)
        ? mensaje.date.toDate()
        : new Date(mensaje.date);

      const fechaClave = fechaObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!grupos[fechaClave]) {
        grupos[fechaClave] = [];
      }
      grupos[fechaClave].push(mensaje);
    }

    return Object.keys(grupos).map(fecha => ({
      fecha,
      mensajes: grupos[fecha]
    }));
  }
}
