import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor() {}

  agruparPorFecha(mensajes: Array<{ date: Date }>) {
    const grupos: { [key: string]: any[] } = {};

    for (const mensaje of mensajes) {
      const fechaObj = new Date(mensaje.date);
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
      fecha: fecha, // ya es string
      mensajes: grupos[fecha]
    }));
  }
}
