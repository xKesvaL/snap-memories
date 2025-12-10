import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { parseMemoriesHTML, MemoryItem } from '@/lib/memories-parser';
import { streamMemoriesToZip, DownloadProgress } from '@/lib/zip-stream';
import { Loader2, Upload, Download, XCircle, FileWarning } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const Route = createFileRoute('/memories')({
  component: MemoriesPage,
  ssr: false,
});

function MemoriesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    setMemories([]);
    setProgress(null);

    try {
      const items = await parseMemoriesHTML(selectedFile);
      setMemories(items);
      if (items.length === 0) {
        toast.warning("No memories found in the file.");
      } else {
        toast.success(`Found ${items.length} memories!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse file.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDownload = async () => {
    if (memories.length === 0) return;

    setIsDownloading(true);
    setProgress({ total: memories.length, processed: 0, currentFile: '', errors: [] });
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await streamMemoriesToZip(memories, (p) => {
        setProgress({ ...p });
      }, abortController.signal);
      
      if (!abortController.signal.aborted) {
         toast.success("Download complete!");
      }
    } catch (err) {
      if (abortController.signal.aborted) {
          toast.info("Download cancelled.");
      } else {
          console.error(err);
          toast.error("An error occurred during download.");
      }
    } finally {
      setIsDownloading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const videoCount = memories.filter(m => m.type === 'Video').length;
  const imageCount = memories.filter(m => m.type === 'Image').length;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Snapchat Memories Downloader</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Upload memories_history.html</CardTitle>
          <CardDescription>
            Select the HTML file from your Snapchat data export.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" accept=".html" onChange={handleFileChange} disabled={isDownloading || isParsing} />
          </div>
        </CardContent>
      </Card>

      {isParsing && (
         <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Parsing file...</span>
         </div>
      )}

      {!isParsing && memories.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Review & Download</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex gap-4 text-sm">
                <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-semibold">Total Memories</div>
                    <div className="text-2xl">{memories.length}</div>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-semibold">Videos</div>
                    <div className="text-2xl">{videoCount}</div>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-semibold">Images</div>
                    <div className="text-2xl">{imageCount}</div>
                </div>
             </div>

             <Alert>
                <FileWarning className="h-4 w-4" />
                <AlertTitle>Browser Limitations</AlertTitle>
                <AlertDescription>
                   For large exports (1000+ items), this process uses your browser's memory and network. 
                   Ensure you have a stable connection. Files will be zipped on-the-fly.
                </AlertDescription>
             </Alert>

             {isDownloading && progress && (
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span>Progress: {progress.processed} / {progress.total}</span>
                    <span>{Math.round((progress.processed / progress.total) * 100)}%</span>
                 </div>
                 <Progress value={(progress.processed / progress.total) * 100} />
                 <div className="text-xs text-muted-foreground truncate">
                    Processing: {progress.currentFile || 'Initializing...'}
                 </div>
               </div>
             )}

             {progress && progress.errors.length > 0 && (
               <div className="mt-4 p-4 bg-destructive/10 rounded text-sm text-destructive max-h-40 overflow-y-auto">
                  <p className="font-bold mb-2">{progress.errors.length} Errors:</p>
                  <ul className="list-disc pl-4 space-y-1">
                      {progress.errors.map((e, i) => (
                          <li key={i}>{e}</li>
                      ))}
                  </ul>
               </div>
             )}

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {isDownloading ? (
               <Button variant="destructive" onClick={handleCancel}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
               </Button>
            ) : (
               <Button onClick={handleDownload} disabled={memories.length === 0}>
                  <Download className="mr-2 h-4 w-4" /> Download Zip
               </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
