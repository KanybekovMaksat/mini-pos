declare module 'html5-qrcode' {
  export class Html5Qrcode {
    constructor(elementId: string);
    start(
      cameraIdOrConfig: string | { facingMode: "user" | "environment" },
      config: { fps?: number; qrbox?: number },
      qrCodeSuccessCallback: (decodedText: string, decodedResult?: any) => void,
      qrCodeErrorCallback?: (errorMessage: string) => void
    ): Promise<void>;
    stop(): Promise<void>;
    clear(): Promise<void>;
  }
}
