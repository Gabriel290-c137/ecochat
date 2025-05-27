import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-infopage',
  templateUrl: './infopage.page.html',
  styleUrls: ['./infopage.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InfopagePage implements OnInit {
  constructor() { }
  ngOnInit() { }
}
