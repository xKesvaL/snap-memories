import { describe, it, expect } from 'vitest';
import { parseMemoriesHTML } from './memories-parser';

describe('parseMemoriesHTML', () => {
  it('should parse valid HTML and extract memory items', async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body>
        <table>
          <tr>
            <td>2025-12-09 15:59:27 UTC</td>
            <td>Video</td>
            <td>Location</td>
            <td><a href="#" onclick="downloadMemories('https://example.com/video.mp4', this, true)">Download</a></td>
          </tr>
          <tr>
            <td>2025-12-10 10:00:00 UTC</td>
            <td>Image</td>
            <td>Location</td>
            <td><a href="#" onclick="downloadMemories('https://example.com/image.jpg', this, true)">Download</a></td>
          </tr>
        </table>
      </body>
      </html>
    `;
    const file = new File([htmlContent], 'memories.html', { type: 'text/html' });

    const memories = await parseMemoriesHTML(file);

    expect(memories).toHaveLength(2);
    expect(memories[0]).toMatchObject({
      date: '2025-12-09 15:59:27 UTC',
      type: 'Video',
      url: 'https://example.com/video.mp4',
    });
    // Check filename formatting (UTC handling might vary by timezone in test env, checking rough format)
    expect(memories[0].filename).toMatch(/Memory_2025-12-09_\d{2}-\d{2}-\d{2}\.mp4/);
    
    expect(memories[1]).toMatchObject({
      type: 'Image',
      url: 'https://example.com/image.jpg',
    });
    expect(memories[1].filename).toMatch(/Memory_2025-12-10_\d{2}-\d{2}-\d{2}\.jpg/);
  });

  it('should handle duplicates by appending index', async () => {
    const htmlContent = `
      <table>
          <tr><td>2025-01-01 10:00:00 UTC</td><td>Image</td><td></td><td><a onclick="downloadMemories('u1')"></a></td></tr>
          <tr><td>2025-01-01 10:00:00 UTC</td><td>Image</td><td></td><td><a onclick="downloadMemories('u2')"></a></td></tr>
      </table>
    `;
    const file = new File([htmlContent], 'test.html', { type: 'text/html' });
    const memories = await parseMemoriesHTML(file);

    expect(memories).toHaveLength(2);
    expect(memories[0].filename).not.toBe(memories[1].filename);
    expect(memories[1].filename).toContain('_1.jpg');
  });

  it('should ignore rows without download links', async () => {
     const htmlContent = `
      <table>
          <tr><th>Date</th><th>Type</th></tr>
          <tr><td>2025-01-01</td><td>Image</td><td></td><td>No Link</td></tr>
      </table>
    `;
    const file = new File([htmlContent], 'test.html', { type: 'text/html' });
    const memories = await parseMemoriesHTML(file);
    expect(memories).toHaveLength(0);
  });
  
  it('should handle empty file gracefully', async () => {
    const file = new File([''], 'empty.html', { type: 'text/html' });
    const memories = await parseMemoriesHTML(file);
    expect(memories).toHaveLength(0);
  });
});

