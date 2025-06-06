import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

  // Ir específicamente al menú
  irMenu() {
    this.router.navigate(['/menu']);
  }

 navegarA(ruta: string) {
  if (ruta.startsWith('http')) {
    window.open(ruta, '_blank');
  } else {
    this.router.navigate([ruta]);
  }
}


  ngOnInit() {}
}
