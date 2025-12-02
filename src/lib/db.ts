const DB_NAME = 'AuthDB';
const DB_VERSION = 1;
const STORE_NAME = 'users';

export type UserRole = 'admin' | 'empresa' | 'estudiante';

interface User {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  lukaPoints?: number;
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'email' });
      }
    };
  });
};

export const registerUser = async (user: User): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(user);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(email);

    request.onsuccess = () => {
      const user = request.result as User;
      if (user && user.password === password) {
        resolve(user);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(email);

    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
};

export const transferMoney = async (
  fromEmail: string,
  toEmail: string,
  amount: number
): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Get sender
    const getSender = store.get(fromEmail);
    getSender.onsuccess = () => {
      const sender = getSender.result as User;
      if (!sender) {
        reject(new Error('Sender not found'));
        return;
      }

      if ((sender.lukaPoints || 0) < amount) {
        reject(new Error('Insufficient points'));
        return;
      }

      // Get recipient
      const getRecipient = store.get(toEmail);
      getRecipient.onsuccess = () => {
        const recipient = getRecipient.result as User;
        if (!recipient) {
          reject(new Error('Recipient not found'));
          return;
        }

        // Update sender
        sender.lukaPoints = (sender.lukaPoints || 0) - amount;
        store.put(sender);

        // Update recipient
        recipient.lukaPoints = (recipient.lukaPoints || 0) + amount;
        store.put(recipient);

        resolve();
      };
      getRecipient.onerror = () => reject(getRecipient.error);
    };
    getSender.onerror = () => reject(getSender.error);
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(email);

    request.onsuccess = () => resolve(request.result as User || null);
    request.onerror = () => reject(request.error);
  });
};

export const updateUserPoints = async (email: string, points: number): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(email);

    request.onsuccess = () => {
      const user = request.result as User;
      if (user) {
        user.lukaPoints = points;
        store.put(user);
        resolve();
      } else {
        reject(new Error('User not found'));
      }
    };
    request.onerror = () => reject(request.error);
  });
};
