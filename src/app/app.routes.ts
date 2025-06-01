import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( (m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.page').then( m => m.MenuPage)
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.page').then( m => m.ConfiguracionPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/historial/historial.page').then( m => m.HistorialPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'control',
    loadComponent: () => import('./pages/control/control.page').then( m => m.ControlPage)
  },
  {
    path: 'infopage',
    loadComponent: () => import('./pages/infopage/infopage.page').then( m => m.InfopagePage)
  },
  {
    path: 'cuenta',
    loadComponent: () => import('./pages/cuenta/cuenta.page').then( m => m.CuentaPage)
  },
  {
    path: 'localizaciones',
    loadComponent: () => import('./pages/localizaciones/localizaciones.page').then( m => m.LocalizacionesPage)
  },
  {
    path: 'donaciones',
    loadComponent: () => import('./pages/donaciones/donaciones.page').then( m => m.DonacionesPage)
  },

];
