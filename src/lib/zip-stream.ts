import * as fflate from 'fflate';
import streamSaver from 'streamsaver';
import pLimit from 'p-limit';
import { MemoryItem } from './memories-parser';

export interface DownloadProgress {
  total: number;
  processed: number;
  currentFile: string;
  errors: string[];
}

export type ProgressCallback = (progress: DownloadProgress) => void;

export async function streamMemoriesToZip(
  memories: MemoryItem[],
  onProgress: ProgressCallback,
  signal?: AbortSignal
) {
  // 1. Setup StreamSaver
  const fileStream = streamSaver.createWriteStream('memories.zip');
  const writer = fileStream.getWriter();

  // 2. Setup fflate Zip
  const zip = new fflate.Zip((err, dat, final) => {
    if (err) {
      console.error('Zip error', err);
      // We should probably abort the writer here
      writer.abort(err);
      return;
    }
    if (dat) {
      writer.write(dat);
    }
    if (final) {
      writer.close();
    }
  });

  const limit = pLimit(3); // Concurrency limit
  let processedCount = 0;
  const errors: string[] = [];

  const updateProgress = (filename: string) => {
    onProgress({
      total: memories.length,
      processed: processedCount,
      currentFile: filename,
      errors
    });
  };

  try {
    const tasks = memories.map((memory) => {
      return limit(async () => {
        if (signal?.aborted) return;

        updateProgress(memory.filename);

        try {
          // Fetch the file
          // Note: This relies on the server allowing CORS or a proxy.
          // Since user selected "Client-side only", we assume direct fetch.
          // If AWS links are signed, they might expire.
          const response = await fetch(memory.url, { signal });
          if (!response.ok) throw new Error(`Failed to fetch ${response.statusText}`);
          
          if (!response.body) throw new Error('No response body');

          // Read stream chunks and add to zip
          // fflate allows adding a file as a stream using ZipPassThrough or simply adding data.
          // For truly streaming 10k files, we can't load the whole file into RAM.
          // We need to pipe the response stream into a Zip file entry.
          
          // Create a Zip entry stream
          const zipFile = new fflate.ZipPassThrough(memory.filename);
          zip.add(zipFile);

          const reader = response.body.getReader();
          
          while (true) {
             const { done, value } = await reader.read();
             if (done) {
                 zipFile.push(new Uint8Array(0), true); // EOF for this file
                 break;
             }
             if (value) {
                 zipFile.push(value);
             }
          }

          processedCount++;
        } catch (err: any) {
          console.error(`Error downloading ${memory.filename}:`, err);
          errors.push(`${memory.filename}: ${err.message}`);
          // Don't fail the whole zip, just skip this file?
          // Or add an error text file?
          // For now, just log and continue.
          processedCount++;
        }
        
        updateProgress(memory.filename);
      });
    });

    await Promise.all(tasks);
    
    // Finalize zip
    zip.end();

  } catch (e: any) {
    console.error("Global error in stream", e);
    // writer.abort(e); // Already handled in zip callback if zip err, but this is outer err
    // If user aborted, we close cleanly?
    if (signal?.aborted) {
        writer.abort('Aborted by user');
    }
  }
}

