declare module 'jquery';
 declare module 'opus-media-recorder';
 declare module 'opus-media-recorder' {
    interface MediaRecorderOptions {
      mimeType: string; // e.g., 'audio/ogg' or 'audio/webm'
    }
  
    interface WorkerOptions {
      OggOpusEncoderWasmPath?: string;
      WebMOpusEncoderWasmPath?: string;
    }
  
    export default class OpusMediaRecorder extends MediaRecorder {
      constructor(
        stream: MediaStream,
        options?: MediaRecorderOptions,
        workerOptions?: WorkerOptions
      );
    }
  }
  
  // Extend the Window interface to include OpusMediaRecorder
  interface Window {
    OpusMediaRecorder: typeof MediaRecorder;
  }
  