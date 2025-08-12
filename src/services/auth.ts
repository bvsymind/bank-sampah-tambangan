// src/services/auth.ts
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  collection, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const auth = getAuth();

export interface Admin {
  uid: string;
  email: string;
  created_at: Date;
  updated_at?: Date;
}

export interface AuthError {
  code: string;
  message: string;
}

export class AuthService {
  // Register new admin
  static async register(email: string, password: string, confirmPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validasi input
      if (!email || !password || !confirmPassword) {
        return { success: false, error: 'Semua field harus diisi' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Format email tidak valid' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password minimal 6 karakter' };
      }

      if (password !== confirmPassword) {
        return { success: false, error: 'Password dan konfirmasi password tidak cocok' };
      }

      // Cek apakah email sudah terdaftar di koleksi admins
      const adminQuery = query(
        collection(db, 'admins'), 
        where('email', '==', email.toLowerCase())
      );
      const adminSnapshot = await getDocs(adminQuery);
      
      if (!adminSnapshot.empty) {
        return { success: false, error: 'Email sudah digunakan' };
      }

      // Buat user baru dengan Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data admin ke Firestore
      const adminData: Omit<Admin, 'created_at' | 'updated_at'> & { 
        created_at: any; 
        updated_at: any; 
      } = {
        uid: user.uid,
        email: email.toLowerCase(),
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      };

      await setDoc(doc(db, 'admins', user.uid), adminData);

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Login admin
  static async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email dan password harus diisi' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Format email tidak valid' };
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verifikasi bahwa user adalah admin yang terdaftar
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (!adminDoc.exists()) {
        await signOut(auth); // Logout jika bukan admin
        return { success: false, error: 'Akses tidak diizinkan' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Logout admin
  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        error: 'Gagal logout' 
      };
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!email) {
        return { success: false, error: 'Email harus diisi' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Format email tidak valid' };
      }

      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  // Get admin data
  static async getAdminData(uid: string): Promise<Admin | null> {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        return {
          uid: adminDoc.id,
          email: data.email,
          created_at: data.created_at.toDate(),
          updated_at: data.updated_at?.toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Get admin data error:', error);
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Validate email format
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get user-friendly error messages
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email sudah digunakan';
      case 'auth/weak-password':
        return 'Password terlalu lemah';
      case 'auth/invalid-email':
        return 'Format email tidak valid';
      case 'auth/user-not-found':
        return 'Email tidak ditemukan';
      case 'auth/wrong-password':
        return 'Password salah';
      case 'auth/invalid-credential':
        return 'Email atau password salah';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan login. Coba lagi nanti';
      case 'auth/network-request-failed':
        return 'Koneksi internet bermasalah';
      default:
        return 'Terjadi kesalahan. Silakan coba lagi';
    }
  }
}