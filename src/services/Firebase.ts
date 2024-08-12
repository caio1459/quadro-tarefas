import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getAuth, Auth } from "firebase/auth";

class FirebaseService {
  private app!: FirebaseApp;
  private database!: Database;
  private auth!: Auth;
  private static instance: FirebaseService;

  private constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyAfqShnhfM5ESahdbtHxIvbmffoQI1gsvg",
      authDomain: "quadro-de-tarefas-7a20d.firebaseapp.com",
      databaseURL:
        "https://quadro-de-tarefas-7a20d-default-rtdb.firebaseio.com",
      projectId: "quadro-de-tarefas-7a20d",
      storageBucket: "quadro-de-tarefas-7a20d.appspot.com",
      messagingSenderId: "468991172322",
      appId: "1:468991172322:web:46d83d429ad9037f29c8bb",
      measurementId: "G-7D458HNXH2",
    };

    if (!getApps().length) {
      console.log("Inicializando Firebase...");
      this.app = initializeApp(firebaseConfig);
    } else {
      console.log("Firebase já inicializado, obtendo instância existente.");
      this.app = getApp();
    }
    this.database = getDatabase(this.app);
    this.auth = getAuth(this.app);
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getApp(): FirebaseApp {
    return this.app;
  }

  public getDatabase(): Database {
    return this.database;
  }

  public getAuth(): Auth {
    return this.auth;
  }
}

export default FirebaseService;
