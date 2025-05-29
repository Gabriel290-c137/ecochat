import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapsService } from '../../services/maps.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-localizaciones',
  templateUrl: './localizaciones.page.html',
  styleUrls: ['./localizaciones.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon, // Solución al error de <ion-icon>
    CommonModule,
    FormsModule
  ]
})
export class LocalizacionesPage implements OnInit {

  constructor(private mapsService: MapsService) { }

  irAlLugar(lat: number, lng: number) {
  this.mapsService.abrirRuta(lat, lng);
}

  ngOnInit() {
  }

}
