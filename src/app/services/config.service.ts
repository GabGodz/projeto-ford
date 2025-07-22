import { Injectable, inject, runInInjectionContext, Injector } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export interface AppConfig {
  geminiApiKey: string;
  firebaseConfig: {
    projectId: string;
    appId: string;
    storageBucket: string;
    apiKey: string;
    authDomain: string;
    messagingSenderId: string;
    measurementId: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;
  private configPromise: Promise<AppConfig> | null = null;
  private injector = inject(Injector);

  constructor(private firestore: Firestore) {}

  async getConfig(): Promise<AppConfig> {
    if (this.config) {
      return this.config;
    }

    if (this.configPromise) {
      return this.configPromise;
    }

    this.configPromise = this.loadConfigFromFirestore();
    this.config = await this.configPromise;
    return this.config;
  }

  async getGeminiApiKey(): Promise<string> {
    const config = await this.getConfig();
    return config.geminiApiKey;
  }

  private async loadConfigFromFirestore(): Promise<AppConfig> {
    return runInInjectionContext(this.injector, async () => {
      const configDoc = doc(this.firestore, 'config', 'app-settings');
      const configSnap = await getDoc(configDoc);
      
      if (configSnap.exists()) {
        const data = configSnap.data() as AppConfig;
        return data;
      } else {
        throw new Error('Configuração não encontrada no Firestore.');
      }
    });
  }

  async updateConfig(newConfig: Partial<AppConfig>): Promise<void> {
    try {
      const configDoc = doc(this.firestore, 'config', 'app-settings');
      const currentConfig = await this.getConfig();
      const updatedConfig = { ...currentConfig, ...newConfig };
      
      console.log('Configuração a ser atualizada:', updatedConfig);
    
      this.config = updatedConfig;
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      throw error;
    }
  }
}