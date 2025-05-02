import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Conversation {
  pregunta: string;
  respuesta: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuHistorialService {
  private mostrarListaSubject = new BehaviorSubject<boolean>(false);
  private conversacionesSubject = new BehaviorSubject<Conversation[]>([]);
  private seleccionadaSubject = new BehaviorSubject<Conversation | null>(null);
  private yaAgregoConversacion = false;

  mostrarLista$ = this.mostrarListaSubject.asObservable();
  conversaciones$ = this.conversacionesSubject.asObservable();
  seleccionada$ = this.seleccionadaSubject.asObservable();

  cambiarMostrarLista(valor: boolean) {
    this.mostrarListaSubject.next(valor);
  }

  agregarConversacion(conv: Conversation) {
    if (this.yaAgregoConversacion) return;
  
    const lista = this.conversacionesSubject.getValue();
    this.conversacionesSubject.next([ conv, ...lista ]);
    this.yaAgregoConversacion = true;
  }

  seleccionarConversacion(conv: Conversation) {
    this.seleccionadaSubject.next(conv);
  }
}
