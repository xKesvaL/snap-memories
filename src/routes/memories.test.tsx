import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Route } from './memories';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen'; // Adjust import if needed, but for unit test we might just render component directly?
// Since Route is exported, we can check Route.options.component
import * as parser from '@/lib/memories-parser';
import * as zipper from '@/lib/zip-stream';

// Mock the parser and zipper
vi.mock('@/lib/memories-parser', () => ({
  parseMemoriesHTML: vi.fn(),
}));

vi.mock('@/lib/zip-stream', () => ({
  streamMemoriesToZip: vi.fn(),
}));

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }
}));

// Access component from the Route definition
const MemoriesPage = Route.options.component as React.ComponentType;

describe('MemoriesPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render upload card initially', () => {
    render(<MemoriesPage />);
    expect(screen.getByText('1. Upload memories_history.html')).toBeDefined();
    expect(screen.getByLabelText('File')).toBeDefined();
  });

  it('should parse file and show download section', async () => {
    // Setup mock return
    const mockMemories = [
      { date: '2025-01-01', type: 'Image' as const, url: 'http://test.com/1.jpg', filename: '1.jpg' },
      { date: '2025-01-02', type: 'Video' as const, url: 'http://test.com/2.mp4', filename: '2.mp4' },
    ];
    (parser.parseMemoriesHTML as any).mockResolvedValue(mockMemories);

    render(<MemoriesPage />);

    // Simulate upload
    const fileInput = screen.getByLabelText('File');
    const file = new File(['<html></html>'], 'memories.html', { type: 'text/html' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('Parsing file...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('2. Review & Download')).toBeDefined();
    });

    // Check stats
    expect(screen.getByText('2')).toBeDefined(); // Total count
    expect(screen.getAllByText('1')).toHaveLength(2); // 1 Image, 1 Video (stats)
  });

  it('should start download when button clicked', async () => {
     const mockMemories = [
      { date: '2025-01-01', type: 'Image' as const, url: 'http://test.com/1.jpg', filename: '1.jpg' },
    ];
    (parser.parseMemoriesHTML as any).mockResolvedValue(mockMemories);
    
    // Setup zipper to simulate progress
    (zipper.streamMemoriesToZip as any).mockImplementation(async (memories: any, onProgress: any) => {
        onProgress({ total: 1, processed: 0, currentFile: '1.jpg', errors: [] });
        await new Promise(resolve => setTimeout(resolve, 10)); // tiny delay
        onProgress({ total: 1, processed: 1, currentFile: '1.jpg', errors: [] });
    });

    render(<MemoriesPage />);

    // Upload first
    const fileInput = screen.getByLabelText('File');
    const file = new File(['<html></html>'], 'memories.html', { type: 'text/html' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => screen.getByText('Download Zip'));

    // Click download
    const downloadBtn = screen.getByText('Download Zip');
    fireEvent.click(downloadBtn);

    // Check progress appears
    await waitFor(() => {
        expect(screen.getByText(/Progress:/)).toBeDefined();
    });
    
    expect(zipper.streamMemoriesToZip).toHaveBeenCalledWith(mockMemories, expect.any(Function), expect.any(AbortSignal));
  });
});
