import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  public userReady = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      this.userReady.next(user);
      if (user) {
        localStorage.setItem('uid', user.uid);
      } else {
        localStorage.removeItem('uid');
      }
    });
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  async register(email: string, password: string) {
    const credential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    const uid = credential.user.uid;
    const userDocRef = doc(this.firestore, `usuarios/${uid}`);
    await setDoc(userDocRef, {
      correo: email,
      creado: new Date()
    });

    return credential;
  }

  logout() {
    return from(signOut(this.auth));
  }

  getUID(): string | null {
    // intenta primero desde currentUser, si no, desde localStorage
    return this.currentUser?.uid || localStorage.getItem('uid');
  }

  getUser(): User | null {
    return this.currentUser;
  }
}
