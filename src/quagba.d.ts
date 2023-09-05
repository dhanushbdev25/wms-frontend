declare module 'quagga' {
    export interface QuaggaStatic {
      init(config: any, callback: (err?: any) => void): void;
      start(): void;
      stop(): void;
      onDetected(callback: (result: any) => void): void;
    }
  
    const Quagga: QuaggaStatic;
    export default Quagga;
  }
  