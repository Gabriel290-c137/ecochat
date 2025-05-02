import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuHistorialService } from '../../services/menuhistorial.service'; 

import { 
  IonContent,
  IonTitle,
  IonButton, 
  IonItem, 
  IonList, 
  IonLabel, 
  IonIcon,  
  IonHeader, 
  IonToolbar, 
  IonButtons, 
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { close, person} from 'ionicons/icons';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle, 
    IonButton, 
    IonItem, 
    IonList, 
    IonLabel, 
    IonIcon, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    CommonModule, 
    FormsModule, 
  ]
})

export class HistorialPage implements OnInit {

  mostrarLista: boolean = false;
  conversaciones: { pregunta: string, respuesta: string }[] = [];

  constructor(
    private router: Router,
    private menuHistorialService: MenuHistorialService
  ) { 
    addIcons({
      close, person
    });
  }

  irMenu() {
    this.router.navigate(['/menu']);
  }

  irConfiguracion() {
    this.router.navigate(['/configuracion']);
  }

  cambiarEstadoLocal() {
    this.menuHistorialService.cambiarMostrarLista(!this.mostrarLista);
  }
  
  ngOnInit() {
    this.menuHistorialService.mostrarLista$.subscribe(valor => {
      this.mostrarLista = valor;
    });

    // Nueva suscripción para obtener la lista de conversaciones
    this.menuHistorialService.conversaciones$.subscribe(lista => {
      this.conversaciones = lista;
    });
  }

  // Método para abrir la conversación al hacer click en el botón
  abrirConversacion(index: number) {
    const selectedConversation = this.conversaciones[index];
    this.menuHistorialService.seleccionarConversacion(selectedConversation);
    this.router.navigate(['/menu']);
  }
}