import { createRootRoute, createRouter } from '@tanstack/react-router';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route as IndexRoute } from './index';

// Mock the memories-parser module
vi.mock('@/lib/memories-parser', () => ({
  parseMemoriesHTML: vi.fn(),
}));

// Mock the zip-stream module
vi.mock('@/lib/zip-stream', () => ({
  streamMemoriesToZip: vi.fn(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Setup a test router
const createTestRouter = () => {
  const rootRoute = createRootRoute({
    component: () => <IndexRoute.options.component />,
  });

  const routeTree = rootRoute.addChildren([IndexRoute]);

  const router = createRouter({
    routeTree,
    history: {
        location: {
            href: 'http://localhost/',
            pathname: '/',
            search: {},
            hash: '',
            state: {},
            key: 'default',
        },
        push: () => {},
        replace: () => {},
        go: () => {},
        back: () => {},
        forward: () => {},
        createHref: () => '',
        encodeLocation: () => ({ pathname: '/', search: '', hash: '' }),
        flush: () => {},
        destroy: () => {},
        listen: () => () => {},
        block: () => () => {},
    } as any, 
  });

  return router;
};

// Since we are unit testing the component logic mostly, we can also just render the component directly
// if we mock the route context properly, but let's try to stick to what might be easier: 
// importing the component function if it was exported, or just testing via router.
// Actually, in the file `src/routes/index.tsx`, the component `MemoriesPage` is not exported directly.
// But `Route.options.component` gives us access to it.

describe('Memories Page', () => {
  const MemoriesPageComponent = IndexRoute.options.component as React.ComponentType;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial state correctly', () => {
    render(<MemoriesPageComponent />);
    
    expect(screen.getByText('Snapchat Memories Downloader')).toBeInTheDocument();
    expect(screen.getByText('1. Upload memories_history.html')).toBeInTheDocument();
    expect(screen.getByLabelText('File')).toBeInTheDocument();
  });

  it('shows file input', () => {
    render(<MemoriesPageComponent />);
    const fileInput = screen.getByLabelText('File');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
  });

  // Add more tests as needed for interaction flows
});
