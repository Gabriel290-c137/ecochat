import { Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  // Esto almacenará las actualizaciones de la conversación
  actualizacionHistorial$ = new BehaviorSubject<{ nombre: string, fecha: string } | null>(null);

  constructor() {}

  agruparPorFecha(mensajes: Array<{ date: Date | Timestamp }>) {
    const grupos: { [key: string]: any[] } = {};

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // eliminar horas para comparación

    for (const mensaje of mensajes) {
      const fechaObj = (mensaje.date instanceof Timestamp)
        ? mensaje.date.toDate()
        : new Date(mensaje.date);

      const fechaComparacion = new Date(fechaObj);
      fechaComparacion.setHours(0, 0, 0, 0);

      // Si es hoy, usar la palabra "Hoy", si no, formatear la fecha
      const fechaClave = fechaComparacion.getTime() === hoy.getTime()
        ? 'Hoy'
        : fechaObj.toLocaleDateString('es-ES', {
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

  formatearFechaUnica(fecha: Date | Timestamp): string {
    const fechaObj = fecha instanceof Timestamp ? fecha.toDate() : new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaComparacion = new Date(fechaObj);
    fechaComparacion.setHours(0, 0, 0, 0);

    if (fechaComparacion.getTime() === hoy.getTime()) {
      return 'Hoy';
    }

    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  }

  actualizarHistorialDesdeMenu(nombreColeccion: string, fecha: Date | Timestamp) {
    const fechaFormateada = this.formatearFechaUnica(fecha);
    this.actualizacionHistorial$.next({
      nombre: nombreColeccion,
      fecha: fechaFormateada
    });
  }
}
