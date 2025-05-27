import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoService } from '../../services/photo.service';
import { UploadService } from '../../services/upload.service';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';
import { EcoChatService } from '../../services/ecochat.service';
import { FileUploadService } from '../../services/fileupload.service';
import { MicrophoneService } from '../../services/microphone.service';
import { MensajeService } from '../../services/mensaje.service';
import { AuthService } from '../../services/auth.service';
import { Firestore, collection, addDoc, doc, getDocs, query, orderBy, limit, setDoc, getDoc} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
// import { MapsService } from '../../services/maps.service';
import { Keyboard } from '@capacitor/keyboard';
import { TextToSpeechService } from '../../services/texttospeech.service';
import { ViewChild } from '@angular/core';

import { 
  IonModal,
  IonTextarea,
  IonChip,
  IonCardHeader,
  IonCardSubtitle,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonFabList
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  create, ellipsisVertical,
  helpCircle, personCircle, logoFirefox, camera, send, add, mic,
  filterOutline,
  imagesSharp, folderOpenSharp,
  locationSharp,
  syncOutline,
  copyOutline,
  copy,
  sync,
  filter,
  locate,
  reorderTwo
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonTextarea,
    IonChip,
    IonCardHeader,
    IonCardSubtitle,
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonRow,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonFabList
  ]
})

export class MenuPage implements OnInit {

  pregunta: string = '';
  respuesta: string = '';
  isLoading: boolean = false;
  fechaActual: Date = new Date();

  mensajes: Array<{
    from: 'user' | 'assistant',
    text: string,
    date: Date
  }> = [];

  
  mensajesAgrupadosPorFecha: { fecha: string, mensajes: any[] }[] = [];
  // uid: string = 'prueba123';
  uid: string = '';
  nombreColeccionConversaciones: string = '';
  numeroConversacion: number = 0;
  isKeyboardOpen = false;
  aliasConversacion: string = '';
  keyboardHeight = 0;
  mostrarModal = false;
  mensajeSeleccionado: any = null;
  touchTimeout: any = null
  @ViewChild('ecoInput', { static: false }) ecoInput: any;

  constructor(
    public photoService: PhotoService,
    private router: Router,
    private geminiService: GeminiService,
    private ecoChatService: EcoChatService,
    public uploadService: UploadService,
    public microphoneService: MicrophoneService,
    public fileUploadService: FileUploadService,
    private mensajeService: MensajeService,
    private firestore: Firestore,
    private authService: AuthService,
    private route: ActivatedRoute,
    // private mapsService: MapsService,
    private textToSpeechService: TextToSpeechService,
  ) {
    addIcons({
      create, ellipsisVertical, add, sync, copy,
      helpCircle, personCircle,
      camera, send, mic, filter, logoFirefox, 
      imagesSharp,folderOpenSharp, locate, reorderTwo
    });

      Keyboard.addListener('keyboardWillShow', (info) => {
        this.isKeyboardOpen = true;
        this.keyboardHeight = info.keyboardHeight; // <- altura real del teclado
      });

      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardOpen = false;
        this.keyboardHeight = 0;
      });
    }

  async cargarAliasConversacion() {
    if (!this.uid || !this.nombreColeccionConversaciones) return;

    const aliasRef = doc(this.firestore, `usuarios/${this.uid}/nombres/${this.nombreColeccionConversaciones}`);
    const aliasSnap = await getDoc(aliasRef);

    if (aliasSnap.exists()) {
      const data = aliasSnap.data();
      this.aliasConversacion = data['alias'] || '';
    } else {
      // Si no existe alias, muestra el nombre de la colección como fallback
      this.aliasConversacion = this.nombreColeccionConversaciones;
    }
  }

  async leerMensaje(texto: string) {
    await this.textToSpeechService.speak(texto);
  }

  onTouchStart(mensaje: any) {
    this.touchTimeout = setTimeout(() => {
      this.mensajeSeleccionado = mensaje;
    }, 500); // medio segundo de presión
  }

  onTouchEnd() {
    clearTimeout(this.touchTimeout);
  }

  irLocalizaciones() { this.router.navigate(['/localizaciones']); }

  irHistorial() {
    this.router.navigate(['/historial']);
  }

  irControl() {
    const coleccion = this.nombreColeccionConversaciones;

    this.router.navigate(['/control'], {
        queryParams: { coleccion: coleccion }
    });
  }

  irHome() {
    this.router.navigate(['/home']);
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  addPhotoToUpload() {
    this.uploadService.addNewToUpload();
  }

  addFileToUpload() {
    this.fileUploadService.pickFileFromDevice();
  }

  nuevaConversacion() {
    this.mensajes = [];
    this.mensajesAgrupadosPorFecha = [];
    this.pregunta = '';
    this.respuesta = '';
    this.nombreColeccionConversaciones = '';
    this.numeroConversacion = 0;

    // Redireccionar a sí mismo para reiniciar el ciclo completo
    this.router.navigate(['/menu'], { queryParams: {} });
    this.mostrarBotones = true;
  }
  
  async obtenerRespuesta() {
    // Asegúrate de establecer la colección antes de continuar
    if (!this.nombreColeccionConversaciones) {
      await this.establecerConversacionInicialSiNoExiste();
    }

    const fotoCamara = this.photoService.photos[0]?.base64 || null;
    const fotoGaleria = this.uploadService.upload[0]?.base64 || null;
    const fotoArchivo = this.fileUploadService.files[0]?.base64 || null;
    const base64 = fotoCamara || fotoGaleria || fotoArchivo;

    if (this.pregunta.trim() === '' && !base64) return;

    this.isLoading = true;

    const preguntaActual = this.pregunta;
    const fechaActual = new Date();

    this.mensajes.push({
      from: 'user',
      text: preguntaActual,
      date: fechaActual
    });
    this.mensajesAgrupadosPorFecha = this.mensajeService.agruparPorFecha(this.mensajes);

    this.pregunta = '';
    this.respuesta = '';

    try {
      // // Obtener la respuesta de Gemini (según si hay imagen o no)
      // if (base64) {
      // // Descomenta esta línea si tienes el método con imagen disponible
      //   this.respuesta = await this.geminiService.generateResponseWithImage(preguntaActual, base64);
      // } else {
      // // Descomenta esta línea si tienes el método sin imagen disponible
      //   this.respuesta = await this.geminiService.generateResponse(preguntaActual);
      // }

      const respuestaActual = this.respuesta || 'Respuesta simulada';
      const fechaRespuesta = new Date();

      this.mensajes.push({
        from: 'assistant',
        text: respuestaActual,
        date: fechaRespuesta
      });
      this.mensajesAgrupadosPorFecha = this.mensajeService.agruparPorFecha(this.mensajes);

        //Descomentar
      // Guardar en Firestore
      const conversacionesRef = collection(this.firestore, `usuarios/${this.uid}/${this.nombreColeccionConversaciones}`);
      await addDoc(conversacionesRef, {
        timestamp: fechaActual,
        mensajes: [
          { from: 'user', text: preguntaActual, date: fechaActual },
          { from: 'assistant', text: respuestaActual, date: fechaRespuesta }
        ]
        // fotos: {
        //   camara: fotoCamara,
        //   galeria: fotoGaleria,
        //   archivo: fotoArchivo
        // }
      });

      // 🔽 Guardar alias solo si no existe aún
        const aliasRef = doc(this.firestore, `usuarios/${this.uid}/nombres/${this.nombreColeccionConversaciones}`);
        const aliasSnap = await getDoc(aliasRef);

        if (!aliasSnap.exists()) {
          await setDoc(aliasRef, {
            alias: this.nombreColeccionConversaciones, // se usa como alias inicial
            fecha: fechaActual
          });
        }
        await this.cargarAliasConversacion();
        this.aliasConversacionCargado = true;
        this.mensajeService.actualizarHistorialDesdeMenu(this.nombreColeccionConversaciones, fechaActual );

      // ✅ Redireccionar si la URL no tiene ?coleccion
      const tieneColeccionEnUrl = this.route.snapshot.queryParamMap.has('coleccion');
      if (!tieneColeccionEnUrl && this.nombreColeccionConversaciones) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { coleccion: this.nombreColeccionConversaciones },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }

    } finally {
      this.isLoading = false;
    }
  }

async usarPregunta(pregunta: string, mensaje: any) {
  // 1) Oculta inmediatamente los botones
  mensaje.preguntas = null;

  // 2) Asigna la pregunta al modelo del textarea
  this.pregunta = pregunta;

  // 3) Lanza la petición como si el usuario hubiera tecleado y enviado
  await this.obtenerRespuesta();
}


  async establecerConversacionInicialSiNoExiste() {
    const maxIntentos = 10;
    const resultados: number[] = [];

    for (let i = 1; i <= maxIntentos; i++) {
      const nombre = i === 1 ? 'conversaciones' : `conversaciones${i}`;
      const ref = collection(this.firestore, `usuarios/${this.uid}/${nombre}`);
      const q = query(ref, orderBy('timestamp', 'desc'), limit(1));

      try {
        const snapshot = await getDocs(q);
        if (!snapshot.empty) resultados.push(i);
      } catch (e) {
        console.error(`Error al verificar ${nombre}`, e);
      }
    }

    const ultimo = resultados.length > 0 ? Math.max(...resultados) : 0;
    this.numeroConversacion = ultimo + 1;
    this.nombreColeccionConversaciones =
      this.numeroConversacion === 1 ? 'conversaciones' : `conversaciones${this.numeroConversacion}`;
  }

  enviar() {
    if (this.pregunta.trim() === '') {
      return;
    }

    const preguntaActual = this.pregunta;

    this.mensajes.push({
      from: 'user',
      text: preguntaActual,
      date: new Date()
    });

    this.pregunta = '';

    this.ecoChatService.enviarPregunta(preguntaActual).subscribe((res) => {
      this.respuesta = res.respuesta;

      this.mensajes.push({
        from: 'assistant',
        text: this.respuesta,
        date: new Date()
      });
    });
  }

  grabarAudio() {
    if (!this.microphoneService.isRecording) {
      this.microphoneService.startListening((textoReconocido: string) => {
        this.pregunta = textoReconocido;
      });
    } else {
      this.microphoneService.stopListening();
    }
  }
  // Descomentar
  async cargarConversacionesDesdeFirestore() {
    const userDocRef = doc(this.firestore, `usuarios/${this.uid}`);
    const conversacionesRef = collection(userDocRef, this.nombreColeccionConversaciones);
  
    const q = query(conversacionesRef, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
  
    const mensajesTotales: any[] = [];
  
    snapshot.forEach(doc => {
      const data = doc.data();
  
      if (data["mensajes"] && Array.isArray(data["mensajes"])) {
        for (let mensaje of data["mensajes"]) {
          const fecha = mensaje.date?.toDate ? mensaje.date.toDate() : new Date(mensaje.date);
          mensajesTotales.push({ ...mensaje, fecha, fotos: data["fotos"] || {} });
        }
      }
    });
  
    this.mensajes = mensajesTotales;
    this.mensajesAgrupadosPorFecha = this.mensajeService.agruparPorFecha(this.mensajes);
    this.verificarInput();
  }

  mostrarBotones: boolean = true;

  aliasConversacionCargado: boolean = false;

  ionViewWillEnter() {
    this.route.queryParams.subscribe(async params => {
      const coleccion = params['coleccion'];
      this.mostrarBotones = !coleccion;

      if (coleccion) {
        this.nombreColeccionConversaciones = coleccion;
        await this.cargarAliasConversacion(); // Esto debe asignar aliasConversacion
        this.aliasConversacionCargado = true;
      } else {
        this.aliasConversacion = '';
        this.aliasConversacionCargado = true;
      }

      if (!this.nombreColeccionConversaciones) {
        await this.establecerConversacionInicialSiNoExiste();
      }

      this.cargarConversacionesDesdeFirestore();
    });
  }


  // Se llama cuando se escribe algo
  verificarInput() {
    const hayTexto = this.pregunta.trim().length > 0;
    const hayMensajes = this.mensajes && this.mensajes.length > 0;

    // Solo mostramos los botones si no hay texto NI mensajes cargados
    this.mostrarBotones = !hayTexto && !hayMensajes;
  }

  // Se llama cuando se toca un botón rápido
  insertarTexto(texto: string) {
    this.pregunta += texto;
    this.mostrarBotones = false;

    Promise.resolve().then(() => {
      this.ecoInput.setFocus();
    });
  }

  // irAlLugar() {
  //   const destinoLat = -21.5375;
  //   const destinoLng = -64.7296;
  //   this.mapsService.abrirRuta(destinoLat, destinoLng);
  // }

  ionViewDidEnter() {
    setTimeout(() => {
      this.ecoInput.setFocus();
    }, 500);
  }

  ngOnInit() {
    this.authService.userReady.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }

    abrirFabYReenfocar() {
    Promise.resolve().then(() => {
      this.ecoInput.setFocus();
    });
  }

  generarPreguntas(mensaje: any) {
    const tema = this.extraerTema(mensaje.text);
    mensaje.preguntas = [
      `¿Qué es ${tema}?`,
      `¿Cómo funciona ${tema}?`,
      `Ejemplo de ${tema}`
    ];

    // Eliminar preguntas después de 10 segundos (10000 ms)
    setTimeout(() => {
      mensaje.preguntas = null;
    }, 10000);
  }

  extraerTema(texto: string): string {
    // Puedes mejorarlo, por ahora toma primeras palabras clave
    const palabras = texto.split(' ');
    return palabras.slice(0, 3).join(' ');
  }

  copiarAlPortapapeles(texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log('Texto copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
    });
  }
}
