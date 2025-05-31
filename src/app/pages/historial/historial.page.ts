import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Firestore, collection, getDocs, query, orderBy, writeBatch, doc, getDoc, updateDoc,deleteDoc } from '@angular/fire/firestore';
import { MensajeService } from 'src/app/services/mensaje.service'; 

import {
  IonModal,
  IonBackButton,
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
  IonInput
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { close, openOutline, person, personCircle, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonBackButton,
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
    IonInput
  ]
})

export class HistorialPage {
  mostrarLista = false;
  uid: string = '';
  colecciones: { nombre: string, fecha: string, alias: string, timestamp: Date }[] = [];
  cargando = true;
  loteActual = 0;
  tamañoLote = 5;
  totalMaximo = 20;
  mostrarModal = false;
  coleccionSeleccionada: any = null;
  mostrarModalCambiarNombre = false;  // Controla la visibilidad del modal para cambiar nombre
  nombreColeccionOriginal = '';       // Almacena el nombre original de la colección
  nuevoNombre = '';                   // Almacena el nuevo nombre que el usuario quiere asignar
  nombreCambiado = false;             // Controla si el nombre fue cambiado para habilitar/deshabilitar el botón


  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor(private router: Router, private mensajeService: MensajeService) {
    addIcons({ close, person, personCircle, trashOutline, openOutline});

    const uid = this.authService.getUID();
    if (uid) {
      this.uid = uid;
      this.cargarColecciones(uid);
    }
  }

  cerrarAmbosModales() {
    this.mostrarModal = false;
    this.mostrarModalCambiarNombre = false;;
  }
  
  async cargarColecciones(uid: string) {
    this.uid = uid;
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
        const nombre = i === 1 ? 'Conversacion' : `Conversacion${i}`;
        const ref = collection(this.firestore, `usuarios/${uid}/${nombre}`);
        const q = query(ref, orderBy('timestamp', 'desc'));

        promesas.push(
          getDocs(q).then(snapshot => {
            if (!snapshot.empty) {
              const doc = snapshot.docs[0];
              const timestamp = doc.get('timestamp');
              const fechaFormateada = this.mensajeService.formatearFechaUnica(timestamp);
              return {
                nombre,
                fecha: fechaFormateada,
                timestamp: timestamp.toDate()  // 🔽 convierte Firestore Timestamp a Date
              };
            }
            return null;
          })
        );
      }

      const resultados = await Promise.all(promesas);
      // Map to include alias property
      const encontrados = resultados
        .filter((item): item is { nombre: string, fecha: string, timestamp: any } => item !== null)
        .map(item => ({ ...item, alias: item.nombre }));
      const aliasCollection = collection(this.firestore, `usuarios/${uid}/nombres`);

      for (const item of encontrados) {
        const aliasDocRef = doc(this.firestore, aliasCollection.path, item.nombre);
        const aliasSnap = await getDoc(aliasDocRef);
        item.alias = aliasSnap.exists() ? aliasSnap.get('alias') : item.nombre;
      }

        this.colecciones.push(...encontrados);
        this.mensajeService.actualizacionHistorial$.subscribe
      // 🔽 Ordenar por la fecha real (más reciente primero)
      this.colecciones.sort((a, b) => {
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

      this.loteActual++;

      // 🔁 Solo carga el siguiente lote si este trajo resultados
      if (encontrados.length > 0 && this.loteActual * this.tamañoLote < this.totalMaximo) {
        await this.cargarLote(uid); // 🔄 Espera completamente el siguiente lote antes de mostrar
      }

    }
  
  irMenu() {
    this.router.navigate(['/menu']);
  }

  irConfiguracion() {
    this.router.navigate(['/configuracion']);
  }

  // cambiarEstadoLocal() {
  //   this.mostrarLista = !this.mostrarLista;
  // }

  abrirConversacion(nombreColeccion: string) {
    this.router.navigate(['/menu'], { queryParams: { coleccion: nombreColeccion } });
  }

  ngOnInit() {
    //   this.mensajeService.actualizacionHistorial$.subscribe(info => {
    //   if (info) {
    //     console.log('🟢 Actualización recibida:', info.fecha);
    //     // Aquí puedes actualizar la UI o recargar la lista
    //     }
    // });
  }
  
  abrirOpciones(coleccion: any) {
      this.coleccionSeleccionada = coleccion;
      this.mostrarModal = true;
    }

    async eliminarConversacion() {
      if (!this.coleccionSeleccionada) return;

      // Eliminar en Firestore
      await this.eliminarSubcoleccion(this.uid, this.coleccionSeleccionada.nombre);

      // Eliminar en la lista visual
      this.colecciones = this.colecciones.filter(c => c !== this.coleccionSeleccionada);

      // Cerrar modal
      this.mostrarModal = false;
      this.coleccionSeleccionada = null;
    }

  async eliminarSubcoleccion(uid: string, nombre: string) {
    const batch = writeBatch(this.firestore);

    // 1. Eliminar documentos en: usuarios/{uid}/{nombre}
    const ref1 = collection(this.firestore, `usuarios/${uid}/${nombre}`);
    const docsSnap1 = await getDocs(ref1);
    docsSnap1.forEach(doc => batch.delete(doc.ref));

    // 2. Eliminar documentos en: usuarios/{uid}/nombres/{nombre}/conversaciones
    const ref2 = collection(this.firestore, `usuarios/${uid}/nombres/${nombre}/Conversacion`);
    const docsSnap2 = await getDocs(ref2);
    docsSnap2.forEach(doc => batch.delete(doc.ref));

    // 3. Eliminar el documento que contiene alias y fecha: usuarios/{uid}/nombres/{nombre}
    const aliasDocRef = doc(this.firestore, `usuarios/${uid}/nombres/${nombre}`);
    batch.delete(aliasDocRef);

    // Ejecutar el batch solo si hay algo que eliminar
    if (!docsSnap1.empty || !docsSnap2.empty) {
      await batch.commit();
    } else {
      // Aun si no hay subcolecciones, eliminar el documento alias
      await deleteDoc(aliasDocRef);
    }
  }



  obtenerFechaReal(fecha: string): Date {
    if (fecha === 'Hoy') {
      return new Date();
    }

    // Intenta parsear manualmente la fecha en español
    const partes = fecha.match(/(\w+), (\d+) de (\w+) de (\d+)/);
    if (!partes) return new Date(0); // Fecha inválida

    const dia = parseInt(partes[2], 10);
    const mesTexto = partes[3];
    const anio = parseInt(partes[4], 10);

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const mes = meses.indexOf(mesTexto.toLowerCase());
    if (mes === -1) return new Date(0);

    return new Date(anio, mes, dia);
  }

  // Método para abrir el modal y configurar el nombre de la colección
  abrirModalCambiarNombre(nombre: string) {
    const seleccionada = this.colecciones.find(c => c.nombre === nombre);
    if (seleccionada) {
      this.coleccionSeleccionada = seleccionada;
      this.nombreColeccionOriginal = seleccionada.alias;
      this.nuevoNombre = seleccionada.alias;
      this.verificarCambioNombre();
      this.mostrarModalCambiarNombre = true;
    }
}

  // Método para verificar si el nombre ha cambiado
  verificarCambioNombre() {
    this.nombreCambiado = this.nuevoNombre.trim() !== '' && this.nuevoNombre !== this.nombreColeccionOriginal;
  }

  // Método para actualizar el nombre de la colección
  async actualizarNombreColeccion() {
    if (this.coleccionSeleccionada && this.nombreCambiado) {
      const nombreColeccion = this.coleccionSeleccionada.nombre;
      const nuevoAlias = this.nuevoNombre.trim();

      try {
        const aliasDocRef = doc(this.firestore, `usuarios/${this.uid}/nombres/${nombreColeccion}`);
        await updateDoc(aliasDocRef, { alias: nuevoAlias });

        // ✅ Actualizar alias en la lista
        const index = this.colecciones.findIndex(c => c.nombre === nombreColeccion);
        if (index !== -1) {
          this.colecciones[index].alias = nuevoAlias;
        }

      } catch (error) {
        console.error('Error al cambiar alias:', error);
      }

      // this.mensajeService.actualizarHistorialDesdeMenu(new Date());
      this.mostrarModalCambiarNombre = false;
      this.coleccionSeleccionada = null;
      this.nombreCambiado = false;
    }
  }

  onNombreInput(event: any) {
    this.nuevoNombre = event.target.value;
    this.verificarCambioNombre();
  }

  cerrarModalCambiarNombre() {
    this.mostrarModalCambiarNombre = false;  // Cierra el modal
  }

}