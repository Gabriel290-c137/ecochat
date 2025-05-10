import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Firestore, collection, getDocs, query, orderBy} from '@angular/fire/firestore';

import {
  IonSpinner,
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
import { close, person } from 'ionicons/icons';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
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

export class HistorialPage {
  mostrarLista = false;
  uid: string = '';
  colecciones: string[] = [];
  cargando = true;
  loteActual = 0;
  tamañoLote = 4;
  totalMaximo = 5;

  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor(private router: Router) {
    addIcons({ close, person });

    const uid = this.authService.getUID();
    if (uid) {
      this.uid = uid;
      this.cargarColecciones(uid);
    }
  }
  
  async cargarColecciones(uid: string) {
    this.colecciones = [];
    this.loteActual = 0;
    this.cargando = true;
    await this.cargarLote(uid);
    this.cargando = false;
  }
  
  async cargarLote(uid: string) {
      const inicio = this.loteActual * this.tamañoLote + 1;
      const fin = Math.min(inicio + this.tamañoLote - 1, this.totalMaximo);

      const promesas = [];

      for (let i = inicio; i <= fin; i++) {
        const nombre = i === 1 ? 'conversaciones' : `conversaciones${i}`;
        const ref = collection(this.firestore, `usuarios/${uid}/${nombre}`);
        const q = query(ref, orderBy('timestamp', 'desc'));

        promesas.push(
          getDocs(q)
            .then(snapshot => {
              if (!snapshot.empty) return nombre;
              return null;
            })
            .catch(e => {
              console.error(`Error consultando ${nombre}`, e);
              return null;
            })
        );
      }

      const resultados = await Promise.all(promesas);
      const encontrados = resultados.filter(nombre => nombre !== null) as string[];
      this.colecciones.push(...encontrados);

      this.loteActual++;

      // 🔁 Solo carga el siguiente lote si este trajo resultados
      if (encontrados.length > 0 && this.loteActual * this.tamañoLote < this.totalMaximo) {
        setTimeout(() => this.cargarLote(uid), 0);
      }
    }
  
  irMenu() {
    this.router.navigate(['/menu']);
  }

  irConfiguracion() {
    this.router.navigate(['/configuracion']);
  }

  cambiarEstadoLocal() {
    this.mostrarLista = !this.mostrarLista;
  }

  abrirConversacion(nombreColeccion: string) {
    this.router.navigate(['/menu'], { queryParams: { coleccion: nombreColeccion } });
  }

  ngOnInit() {
    
  }
  
}

