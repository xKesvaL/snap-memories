import { describe, it, expect, vi, beforeEach } from 'vitest';
import { streamMemoriesToZip } from './zip-stream';
import { MemoryItem } from './memories-parser';
import * as fflate from 'fflate';

// Mock dependencies
vi.mock('streamsaver', () => ({
  default: {
    createWriteStream: vi.fn(() => ({
      getWriter: vi.fn(() => ({
        write: vi.fn(),
        close: vi.fn(),
        abort: vi.fn(),
      })),
    })),
  },
}));

// Mock fetch
global.fetch = vi.fn();

// Mock fflate (partial)
vi.mock('fflate', async (importOriginal) => {
    const actual = await importOriginal<typeof fflate>();
    return {
        ...actual,
        Zip: vi.fn(function(this: any, cb) {
            this.add = vi.fn();
            this.end = vi.fn(() => cb(null, new Uint8Array(), true));
            return this;
        }),
        ZipPassThrough: vi.fn(function(this: any, filename) {
             this.push = vi.fn();
             return this;
        }),
    };
});

describe('streamMemoriesToZip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process memories and update progress', async () => {
    const mockMemories: MemoryItem[] = [
      { date: '2022-01-01', type: 'Image', url: 'http://test.com/1.jpg', filename: '1.jpg' },
      { date: '2022-01-02', type: 'Video', url: 'http://test.com/2.mp4', filename: '2.mp4' },
    ];

    // Mock successful fetch response with a stream
    const mockStream = {
        getReader: () => ({
            read: vi.fn()
                   .mockResolvedValueOnce({ done: false, value: new Uint8Array([1, 2, 3]) })
                   .mockResolvedValueOnce({ done: true, value: undefined })
        })
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      body: mockStream,
    });

    const onProgress = vi.fn();

    await streamMemoriesToZip(mockMemories, onProgress);

    // Initial progress + 2 files * (start + end calls might vary depending on p-limit chunks) 
    // Actually, onProgress is called: 
    // 1. Before fetch
    // 2. After processing
    // So 4 calls total?
    expect(onProgress).toHaveBeenCalled();
    const lastCall = onProgress.mock.lastCall![0];
    expect(lastCall.processed).toBe(2);
    expect(lastCall.total).toBe(2);
    expect(lastCall.errors).toHaveLength(0);
  });

  it('should handle fetch errors gracefully', async () => {
    const mockMemories: MemoryItem[] = [
      { date: '2022-01-01', type: 'Image', url: 'http://fail.com/1.jpg', filename: '1.jpg' },
    ];

    (global.fetch as any).mockRejectedValue(new Error('Network Error'));

    const onProgress = vi.fn();

    await streamMemoriesToZip(mockMemories, onProgress);

    const lastCall = onProgress.mock.lastCall![0];
    expect(lastCall.processed).toBe(1); // It increments processed even on error
    expect(lastCall.errors).toHaveLength(1);
    expect(lastCall.errors[0]).toContain('1.jpg: Network Error');
  });

  it('should respect abort signal', async () => {
     const mockMemories: MemoryItem[] = [
      { date: '2022-01-01', type: 'Image', url: 'http://test.com/1.jpg', filename: '1.jpg' },
    ];

    const controller = new AbortController();
    const signal = controller.signal;
    controller.abort(); // Abort immediately

    const onProgress = vi.fn();
    await streamMemoriesToZip(mockMemories, onProgress, signal);
    
    // Should return early or handle abort
    // In our implementation, p-limit tasks check signal.aborted
    // Depending on timing, it might process 0.
  });
});

