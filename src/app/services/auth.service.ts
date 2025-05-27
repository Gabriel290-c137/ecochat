import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: User | null = null;
  public userReady = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(auth, (u) => {
      this.user = u;
      this.userReady.next(u);
      localStorage[u ? 'setItem' : 'removeItem']('uid', u?.uid ?? '');
    });
  }

  login = (email: string, password: string) =>
    from(signInWithEmailAndPassword(this.auth, email, password));

  async register(email: string, password: string): Promise<'nuevo' | 'existente'> {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
      await setDoc(doc(this.firestore, `usuarios/${user.uid}`), {
        correo: email,
        creado: new Date()
      });
      return 'nuevo';
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return 'existente';
      }
      throw error; // Otros errores como contraseña débil, etc.
    }
  }

  logout = () => from(signOut(this.auth));

  getUID = (): string | null => this.user?.uid || localStorage.getItem('uid');

  getUsuario(): User | null {
    return this.user;
  }

  getCorreo(): string | null {
    return this.user?.email || null;
  }

  getNombre(): string {
    if (!this.user?.email) return '';
    const parteLocal = this.user.email.split('@')[0];
    const partes = parteLocal.split('.');
    return partes.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  }

}
