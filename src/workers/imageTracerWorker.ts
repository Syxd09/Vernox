/**
 * Web Worker for Asynchronous Image-to-Vector Tracing
 * Prevents UI freeze when processing high-resolution customer artwork
 */

import { traceImageToVector, type ImageBitmapData, type TraceOptions, type TraceResult } from '../lib/imageTracer';

export interface WorkerMessageRequest {
  id: string;
  image: ImageBitmapData;
  options?: TraceOptions;
}

export interface WorkerMessageResponse {
  id: string;
  result?: TraceResult;
  error?: string;
}

// Handle incoming messages in worker context
if (typeof self !== 'undefined') {
  self.onmessage = (event: MessageEvent<WorkerMessageRequest>) => {
    const { id, image, options } = event.data;
    try {
      const result = traceImageToVector(image, options);
      self.postMessage({ id, result } as WorkerMessageResponse);
    } catch (err: any) {
      self.postMessage({ id, error: err.message || 'Image tracing failed' } as WorkerMessageResponse);
    }
  };
}
