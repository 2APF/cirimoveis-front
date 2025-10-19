    declare module '*.vue' {
      import type { DefineComponent } from 'vue';
      const component: DefineComponent<{}, {}, any>;
      export default component;
    }

    
    declare module 'panolens' {
      const PANOLENS: any;
      export = PANOLENS;
    }


  declare module 'pdfjs-dist/build/pdf' {
    import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
    const pdfjsLib: {
      getDocument: (src: string | Uint8Array | { data: Uint8Array }) => {
        promise: Promise<PDFDocumentProxy>;
      };
      GlobalWorkerOptions: {
        workerSrc: string;
      };
    };
    export default pdfjsLib;
  }
          declare module '*.vue' {
          import type { DefineComponent } from 'vue';
          const component: DefineComponent<object, object, any>;
          export default component;
        }
  
  declare module '@/components/wallet/FooterComponent.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  

    /// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
  export function registerSW(options?: {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: any) => void;
  }): void;
}


  declare module '@/views/wallet/money/transationWalletView.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  declare module '@chenfengyuan/vue-qrcode'{
    
    import { QrcodeStream } from 'vue';
    const component: QrcodeStream<{}, {}, any>;
    export default component;
  }


  declare module 'laravel-echo' {
    import { Channel } from 'pusher-js';
  
    export default class Echo {
      constructor(options: any);
      channel(channel: string): PusherChannel;
      leave(channel: string): void;
    }
  
    export interface PusherChannel extends Channel {
      whisper(eventName: string, data: any): PusherChannel;
      listen(eventName: string, callback: (e: any) => void): PusherChannel;
    }
  }