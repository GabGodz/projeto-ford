import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';

// Configuração mínima do Firebase - as chaves reais virão do Firestore
const firebaseConfig = {
  projectId: 'project-f853d',
  appId: '1:1234567890:web:abcdef1234567890abcdef',
  storageBucket: 'project-f853d.firebasestorage.app',
  apiKey: 'AIzaSyDdNhOrjDwqzP64wW4spGyJjG3CKHkqJcQ', // Apenas para inicialização
  authDomain: 'project-f853d.firebaseapp.com',
  messagingSenderId: '1234567890',
  measurementId: 'G-XXXXXXXXXX'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
