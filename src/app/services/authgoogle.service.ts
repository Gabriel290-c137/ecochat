import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Auth, signInWithPopup, signInWithCredential, GoogleAuthProvider, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class AuthgoogleService {
  private user: User | null = null;
  public userReady = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {}

  async signInWithGoogle(): Promise<void> {
    try {
      let resultUser: User;

      if (Capacitor.getPlatform() === 'web') {

        // 🌐 Web (navegador)
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this.auth, provider);
        resultUser = result.user;

      } else {
        // 📱 Móvil nativo

        // 🔁 Forzar selección de cuenta
        await GoogleAuth.signOut();

        const googleUser = await GoogleAuth.signIn();
        const idToken = googleUser.authentication.idToken;

        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(this.auth, credential);
        resultUser = result.user;
      }

      this.user = resultUser;
      this.userReady.next(resultUser);
      localStorage.setItem('uid', resultUser.uid);

      const userRef = doc(this.firestore, `usuarios/${resultUser.uid}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          nombre: resultUser.displayName,
          correo: resultUser.email,
          creado: new Date()
        });
      }

    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  // ✅ Nuevo método para cerrar sesión completamente
  async logout(): Promise<void> {
    try {
      await this.auth.signOut(); // Firebase
      if (Capacitor.getPlatform() !== 'web') {
        await GoogleAuth.signOut(); // Google (nativo)
      }
      this.user = null;
      this.userReady.next(null);
      localStorage.removeItem('uid');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  getUsuario(): User | null {
    return this.user;
  }

  getCorreo(): string | null {
    return this.user?.email || null;
  }

  getNombre(): string {
    if (this.user?.displayName) return this.user.displayName;

    if (!this.user?.email) return '';
    const parteLocal = this.user.email.split('@')[0];
    const partes = parteLocal.split('.');
    return partes.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  }

  getUID(): string | null {
    return this.user?.uid || localStorage.getItem('uid');
  }
}
