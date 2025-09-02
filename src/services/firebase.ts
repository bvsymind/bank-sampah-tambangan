// import { initializeApp } from 'firebase/app';
// import { 
//   getFirestore, 
//   collection, 
//   doc, 
//   getDocs, 
//   getDoc,
//   addDoc, 
//   updateDoc, 
//   deleteDoc, 
//   query, 
//   where, 
//   orderBy, 
//   limit,
//   onSnapshot,
//   Timestamp,
//   writeBatch
// } from 'firebase/firestore';
// import { 
//   getAuth,
//   connectAuthEmulator
// } from 'firebase/auth';
// import { 
//   getStorage, 
//   ref, 
//   uploadBytes, 
//   getDownloadURL, 
//   deleteObject 
// } from 'firebase/storage';


// const firebaseConfig = {
//   apiKey:              import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain:          import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId:           import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket:       import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId:   import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId:               import.meta.env.VITE_FIREBASE_APP_ID,
// };


// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);

// if (import.meta.env.DEV) {
// }


// export interface Admin {
//   uid: string;
//   email: string;
//   created_at: Date;
//   updated_at?: Date;
// }

// export interface Nasabah {
//   id: string;
//   id_nasabah: string;
//   nama: string;
//   alamat: string;
//   saldo: number;
//   created_at: Date;
//   updated_at?: Date;
// }

// export interface JenisSampah {
//   id: string;
//   nama: string;
//   harga_kg: number;
//   foto_url: string;
//   is_active: boolean;
//   created_at: Date;
//   updated_at?: Date;
// }

// export interface TransactionItem {
//   nama_sampah: string;
//   berat_kg: number;
//   harga_kg: number;
//   subtotal: number;
// }

// export interface Transaksi {
//   id: string;
//   id_nasabah: string;
//   nama_nasabah: string;
//   timestamp: Date;
//   tipe: 'setor' | 'tarik';
//   total_harga: number;
//   total_berat_kg: number;
//   items: TransactionItem[];
//   created_at: Date;
//   processed_by?: string;
// }

// export const formatRupiah = (amount: number): string => {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0
//   }).format(amount);
// };

// export const formatDate = (date: Date): string => {
//   return new Intl.DateTimeFormat('id-ID', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   }).format(date);
// };

// export const formatDateOnly = (date: Date): string => {
//   return new Intl.DateTimeFormat('id-ID', {
//     day: '2-digit',
//     month: 'short', 
//     year: 'numeric'
//   }).format(date);
// };

// export const adminService = {
//   async getByUid(uid: string): Promise<Admin | null> {
//     try {
//       const docSnap = await getDoc(doc(db, 'admins', uid));
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         return {
//           uid: docSnap.id,
//           email: data.email,
//           created_at: data.created_at.toDate(),
//           updated_at: data.updated_at?.toDate()
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error('Get admin error:', error);
//       return null;
//     }
//   },


//   async getAll(): Promise<Admin[]> {
//     try {
//       const querySnapshot = await getDocs(
//         query(collection(db, 'admins'), orderBy('created_at', 'desc'))
//       );
//       return querySnapshot.docs.map(doc => ({
//         uid: doc.id,
//         ...doc.data(),
//         created_at: doc.data().created_at.toDate(),
//         updated_at: doc.data().updated_at?.toDate()
//       })) as Admin[];
//     } catch (error) {
//       console.error('Get all admins error:', error);
//       return [];
//     }
//   }
// };

// export const nasabahService = {
//   async getAll(): Promise<Nasabah[]> {
//     const querySnapshot = await getDocs(
//       query(collection(db, 'nasabah'), orderBy('created_at', 'desc'))
//     );
//     return querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//       created_at: doc.data().created_at.toDate(),
//       updated_at: doc.data().updated_at?.toDate()
//     })) as Nasabah[];
//   },

//   async getById(id: string): Promise<Nasabah | null> {
//     const docSnap = await getDoc(doc(db, 'nasabah', id));
//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       return {
//         id: docSnap.id,
//         ...data,
//         created_at: data.created_at.toDate(),
//         updated_at: data.updated_at?.toDate()
//       } as Nasabah;
//     }
//     return null;
//   },

//   async getByIdNasabah(id_nasabah: string): Promise<Nasabah | null> {
//     const q = query(collection(db, 'nasabah'), where('id_nasabah', '==', id_nasabah));
//     const querySnapshot = await getDocs(q);
//     if (!querySnapshot.empty) {
//       const doc = querySnapshot.docs[0];
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data,
//         created_at: data.created_at.toDate(),
//         updated_at: data.updated_at?.toDate()
//       } as Nasabah;
//     }
//     return null;
//   },

//   async add(nasabah: Omit<Nasabah, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
//     const docRef = await addDoc(collection(db, 'nasabah'), {
//       ...nasabah,
//       created_at: Timestamp.now(),
//       updated_at: Timestamp.now()
//     });
//     return docRef.id;
//   },

//   async update(id: string, nasabah: Partial<Nasabah>): Promise<void> {
//     const docRef = doc(db, 'nasabah', id);
//     await updateDoc(docRef, {
//       ...nasabah,
//       updated_at: Timestamp.now()
//     });
//   },

//   async delete(nasabahDocId: string, id_nasabah: string): Promise<void> {
//     const batch = writeBatch(db);

//     const transaksiQuery = query(collection(db, 'transaksi'), where('id_nasabah', '==', id_nasabah));
//     const transaksiSnapshot = await getDocs(transaksiQuery);

//     transaksiSnapshot.forEach(doc => {
//       batch.delete(doc.ref);
//     });

//     const nasabahRef = doc(db, 'nasabah', nasabahDocId);
//     batch.delete(nasabahRef);

//     await batch.commit();
//   },
//   async updateSaldo(id: string, newSaldo: number): Promise<void> {
//     const docRef = doc(db, 'nasabah', id);
//     await updateDoc(docRef, {
//       saldo: newSaldo,
//       updated_at: Timestamp.now()
//     });
//   }
// };

// export const jenisSampahService = {
//   async getAll(): Promise<JenisSampah[]> {
//     const q = query(
//       collection(db, 'jenis_sampah'), 
//       where('is_active', '==', true),
//       orderBy('created_at', 'desc')
//     );
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//       created_at: doc.data().created_at.toDate(),
//       updated_at: doc.data().updated_at?.toDate()
//     })) as JenisSampah[];
//   },

//   async add(jenisSampah: Omit<JenisSampah, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<string> {
//     const docRef = await addDoc(collection(db, 'jenis_sampah'), {
//       ...jenisSampah,
//       is_active: true,
//       created_at: Timestamp.now(),
//       updated_at: Timestamp.now()
//     });
//     return docRef.id;
//   },

//   async update(id: string, jenisSampah: Partial<JenisSampah>): Promise<void> {
//     const docRef = doc(db, 'jenis_sampah', id);
//     await updateDoc(docRef, {
//       ...jenisSampah,
//       updated_at: Timestamp.now()
//     });
//   },

//   async delete(id: string): Promise<void> {
//     const docRef = doc(db, 'jenis_sampah', id);
//     await updateDoc(docRef, {
//       is_active: false,
//       updated_at: Timestamp.now()
//     });
//   }
// };

// export const transaksiService = {
//   async getAll(startDate?: Date, endDate?: Date, id_nasabah?: string): Promise<Transaksi[]> {
//     let q = query(collection(db, 'transaksi'), orderBy('timestamp', 'asc'));
    
//     if (startDate && endDate) {
//       q = query(q, 
//         where('timestamp', '>=', Timestamp.fromDate(startDate)),
//         where('timestamp', '<=', Timestamp.fromDate(endDate))
//       );
//     }
    
//     if (id_nasabah) {
//       q = query(q, where('id_nasabah', '==', id_nasabah));
//     }

//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//       timestamp: doc.data().timestamp.toDate(),
//       created_at: doc.data().created_at.toDate()
//     })) as Transaksi[];
//   },

//   async addSetor(transaksi: Omit<Transaksi, 'id' | 'created_at'>, processedBy?: string): Promise<string> {
//     const batch = writeBatch(db);
    
//     const transaksiRef = doc(collection(db, 'transaksi'));
//     batch.set(transaksiRef, {
//       ...transaksi,
//       timestamp: Timestamp.fromDate(transaksi.timestamp),
//       processed_by: processedBy || null, 
//       created_at: Timestamp.now()
//     });

//     const nasabah = await nasabahService.getByIdNasabah(transaksi.id_nasabah);
//     if (nasabah && nasabah.id) {
//       const nasabahRef = doc(db, 'nasabah', nasabah.id);
//       batch.update(nasabahRef, {
//         saldo: nasabah.saldo + transaksi.total_harga,
//         updated_at: Timestamp.now()
//       });
//     }

//     await batch.commit();
//     return transaksiRef.id;
//   },

//   async addTarik(id_nasabah: string, nama_nasabah: string, amount: number, processedBy?: string): Promise<string> {
//     const batch = writeBatch(db);
    
//     const transaksiRef = doc(collection(db, 'transaksi'));
//     batch.set(transaksiRef, {
//       id_nasabah,
//       nama_nasabah,
//       timestamp: Timestamp.now(),
//       tipe: 'tarik',
//       total_harga: -amount,
//       total_berat_kg: 0,
//       items: [],
//       processed_by: processedBy || null,
//       created_at: Timestamp.now()
//     });

//     const nasabah = await nasabahService.getByIdNasabah(id_nasabah);
//     if (nasabah && nasabah.id) {
//       const nasabahRef = doc(db, 'nasabah', nasabah.id);
//       batch.update(nasabahRef, {
//         saldo: nasabah.saldo - amount,
//         updated_at: Timestamp.now()
//       });
//     }

//     await batch.commit();
//     return transaksiRef.id;
//   }
// };
// export const storageService = {
//   async uploadImage(file: File, path: string): Promise<string> {
//     const imageRef = ref(storage, path);
//     const snapshot = await uploadBytes(imageRef, file);
//     return await getDownloadURL(snapshot.ref);
//   },

//   async deleteImage(url: string): Promise<void> {
//     const imageRef = ref(storage, url);
//     await deleteObject(imageRef);
//   }
// };

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  getAuth,
  connectAuthEmulator
} from 'firebase/auth';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';


const firebaseConfig = {
  apiKey:               import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:           import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:            import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:                import.meta.env.VITE_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

if (import.meta.env.DEV) {
}


export interface Admin {
  uid: string;
  email: string;
  created_at: Date;
  updated_at?: Date;
}

export interface Nasabah {
  id: string;
  id_nasabah: string;
  nama: string;
  alamat: string;
  saldo: number;
  created_at: Date;
  updated_at?: Date;
}

export interface JenisSampah {
  id: string;
  nama: string;
  harga_kg: number;
  foto_url: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface TransactionItem {
  nama_sampah: string;
  berat_kg: number;
  harga_kg: number;
  subtotal: number;
}

export interface Transaksi {
  id: string;
  id_nasabah: string;
  nama_nasabah: string;
  timestamp: Date;
  tipe: 'setor' | 'tarik';
  total_harga: number;
  total_berat_kg: number;
  items: TransactionItem[];
  created_at: Date;
  processed_by?: string;
}

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDateOnly = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short', 
    year: 'numeric'
  }).format(date);
};

export const adminService = {
  async getByUid(uid: string): Promise<Admin | null> {
    try {
      const docSnap = await getDoc(doc(db, 'admins', uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          uid: docSnap.id,
          email: data.email,
          created_at: data.created_at.toDate(),
          updated_at: data.updated_at?.toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Get admin error:', error);
      return null;
    }
  },


  async getAll(): Promise<Admin[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'admins'), orderBy('created_at', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at.toDate(),
        updated_at: doc.data().updated_at?.toDate()
      })) as Admin[];
    } catch (error) {
      console.error('Get all admins error:', error);
      return [];
    }
  }
};

// =================== PERUBAHAN DIMULAI DI SINI ===================

// 1. Variabel untuk menyimpan cache data nasabah
let allNasabahCache: Nasabah[] | null = null;

export const nasabahService = {
  // 2. Fungsi getAll dimodifikasi untuk menggunakan dan mengisi cache
  async getAll(): Promise<Nasabah[]> {
    if (allNasabahCache) {
      return allNasabahCache;
    }
    const querySnapshot = await getDocs(
      query(collection(db, 'nasabah'), orderBy('nama', 'asc')) // Diurutkan berdasarkan nama untuk tampilan yang lebih baik
    );
    const nasabahList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as Nasabah[];

    allNasabahCache = nasabahList; // Simpan hasil ke cache
    return nasabahList;
  },

  // 3. Fungsi baru untuk pencarian hibrida
  async searchNasabah(queryText: string): Promise<Nasabah[]> {
    const normalizedQuery = queryText.toLowerCase();
    
    // Panggil getAll() yang sudah mendukung cache
    const allNasabah = await this.getAll();
    
    if (!normalizedQuery) {
        return [];
    }

    // Filter di sisi klien berdasarkan nama atau ID
    return allNasabah.filter(nasabah => 
        nasabah.nama.toLowerCase().includes(normalizedQuery) ||
        nasabah.id_nasabah.includes(normalizedQuery)
    );
  },

  async getById(id: string): Promise<Nasabah | null> {
    const docSnap = await getDoc(doc(db, 'nasabah', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created_at: data.created_at.toDate(),
        updated_at: data.updated_at?.toDate()
      } as Nasabah;
    }
    return null;
  },

  async getByIdNasabah(id_nasabah: string): Promise<Nasabah | null> {
    const q = query(collection(db, 'nasabah'), where('id_nasabah', '==', id_nasabah));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at.toDate(),
        updated_at: data.updated_at?.toDate()
      } as Nasabah;
    }
    return null;
  },

  // 4. Fungsi add, update, dan delete diubah untuk mengosongkan cache
  async add(nasabah: Omit<Nasabah, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'nasabah'), {
      ...nasabah,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    allNasabahCache = null; // Kosongkan cache
    return docRef.id;
  },

  async update(id: string, nasabah: Partial<Nasabah>): Promise<void> {
    const docRef = doc(db, 'nasabah', id);
    await updateDoc(docRef, {
      ...nasabah,
      updated_at: Timestamp.now()
    });
    allNasabahCache = null; // Kosongkan cache
  },

  async delete(nasabahDocId: string, id_nasabah: string): Promise<void> {
    const batch = writeBatch(db);

    const transaksiQuery = query(collection(db, 'transaksi'), where('id_nasabah', '==', id_nasabah));
    const transaksiSnapshot = await getDocs(transaksiQuery);

    transaksiSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    const nasabahRef = doc(db, 'nasabah', nasabahDocId);
    batch.delete(nasabahRef);

    await batch.commit();
    allNasabahCache = null; // Kosongkan cache
  },

  async updateSaldo(id: string, newSaldo: number): Promise<void> {
    const docRef = doc(db, 'nasabah', id);
    await updateDoc(docRef, {
      saldo: newSaldo,
      updated_at: Timestamp.now()
    });
    // Tidak perlu kosongkan cache di sini jika hanya saldo yg berubah, 
    // karena cache akan diperbarui saat transaksi (yang memanggil ini) selesai.
    // Tapi untuk konsistensi, bisa ditambahkan: allNasabahCache = null;
  }
};
// =================== AKHIR DARI PERUBAHAN ===================


export const jenisSampahService = {
  async getAll(): Promise<JenisSampah[]> {
    const q = query(
      collection(db, 'jenis_sampah'), 
      where('is_active', '==', true),
      orderBy('created_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as JenisSampah[];
  },

  async add(jenisSampah: Omit<JenisSampah, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'jenis_sampah'), {
      ...jenisSampah,
      is_active: true,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, jenisSampah: Partial<JenisSampah>): Promise<void> {
    const docRef = doc(db, 'jenis_sampah', id);
    await updateDoc(docRef, {
      ...jenisSampah,
      updated_at: Timestamp.now()
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'jenis_sampah', id);
    await updateDoc(docRef, {
      is_active: false,
      updated_at: Timestamp.now()
    });
  }
};

export const transaksiService = {
  async getAll(startDate?: Date, endDate?: Date, id_nasabah?: string): Promise<Transaksi[]> {
    let q = query(collection(db, 'transaksi'), orderBy('timestamp', 'asc'));
    
    if (startDate && endDate) {
      q = query(q, 
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );
    }
    
    if (id_nasabah) {
      q = query(q, where('id_nasabah', '==', id_nasabah));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
      created_at: doc.data().created_at.toDate()
    })) as Transaksi[];
  },

  async addSetor(transaksi: Omit<Transaksi, 'id' | 'created_at'>, processedBy?: string): Promise<string> {
    const batch = writeBatch(db);
    
    const transaksiRef = doc(collection(db, 'transaksi'));
    batch.set(transaksiRef, {
      ...transaksi,
      timestamp: Timestamp.fromDate(transaksi.timestamp),
      processed_by: processedBy || null, 
      created_at: Timestamp.now()
    });

    const nasabah = await nasabahService.getByIdNasabah(transaksi.id_nasabah);
    if (nasabah && nasabah.id) {
      const nasabahRef = doc(db, 'nasabah', nasabah.id);
      batch.update(nasabahRef, {
        saldo: nasabah.saldo + transaksi.total_harga,
        updated_at: Timestamp.now()
      });
    }

    await batch.commit();
    allNasabahCache = null; // Kosongkan cache setelah transaksi
    return transaksiRef.id;
  },

  async addTarik(id_nasabah: string, nama_nasabah: string, amount: number, processedBy?: string): Promise<string> {
    const batch = writeBatch(db);
    
    const transaksiRef = doc(collection(db, 'transaksi'));
    batch.set(transaksiRef, {
      id_nasabah,
      nama_nasabah,
      timestamp: Timestamp.now(),
      tipe: 'tarik',
      total_harga: -amount,
      total_berat_kg: 0,
      items: [],
      processed_by: processedBy || null,
      created_at: Timestamp.now()
    });

    const nasabah = await nasabahService.getByIdNasabah(id_nasabah);
    if (nasabah && nasabah.id) {
      const nasabahRef = doc(db, 'nasabah', nasabah.id);
      batch.update(nasabahRef, {
        saldo: nasabah.saldo - amount,
        updated_at: Timestamp.now()
      });
    }

    await batch.commit();
    allNasabahCache = null; // Kosongkan cache setelah transaksi
    return transaksiRef.id;
  }
};
export const storageService = {
  async uploadImage(file: File, path: string): Promise<string> {
    const imageRef = ref(storage, path);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  async deleteImage(url: string): Promise<void> {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  }
};
