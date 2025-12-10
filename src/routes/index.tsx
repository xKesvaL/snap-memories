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
import { Loader2, Download, XCircle, FileWarning, Upload, CheckCircle2, RefreshCcw, Film, Image as ImageIcon, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export const Route = createFileRoute('/')({
  component: MemoriesPage,
  ssr: false,
  head: () => ({
    meta: [
      {
        title: 'SnapMemories | Download Snapchat Memories',
      },
      {
        name: 'description',
        content: 'The easiest and most secure way to download your Snapchat memories. Processed locally in your browser, no data upload.',
      },
    ],
  }),
});

type Step = 1 | 2 | 3;

function MemoriesPage() {
  const [parent] = useAutoAnimate();
  const [step, setStep] = useState<Step>(1);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [concurrency, setConcurrency] = useState('3');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

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
        setStep(2);
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
      }, abortController.signal, parseInt(concurrency));
      
      if (!abortController.signal.aborted) {
         toast.success("Download complete!");
         setStep(3);
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

  const handleReset = () => {
    setMemories([]);
    setProgress(null);
    setStep(1);
    setIsDownloading(false);
    setIsParsing(false);
  };

  const videoCount = memories.filter(m => m.type === 'Video').length;
  const imageCount = memories.filter(m => m.type === 'Image').length;

  return (
    <div className="container mx-auto p-6 max-w-2xl min-h-[80vh] flex flex-col justify-center items-center" ref={parent}>
      
      {step === 1 && (
        <Card className="w-full shadow-lg border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors bg-white/50 backdrop-blur-sm">
          <CardHeader className="text-center pt-10">
            <div className="mx-auto bg-[#f9f601] w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Upload className="w-10 h-10 text-black" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Upload memories_history.html</CardTitle>
            <CardDescription className="text-lg mt-3 max-w-md mx-auto">
              Select the HTML file from your Snapchat data export to start downloading your memories.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10 pt-4">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group w-full max-w-sm">
                 <div className="absolute inset-0 bg-[#f9f601]/20 rounded-xl transform transition-transform group-hover:scale-105" />
                 <label 
                    htmlFor="file" 
                    className="relative block w-full text-center p-4 bg-white border-2 border-black rounded-xl cursor-pointer hover:bg-gray-50 transition-colors font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                 >
                    {isParsing ? 'Processing...' : 'Select File'}
                 </label>
                 <Input 
                  id="file" 
                  type="file" 
                  accept=".html" 
                  onChange={handleFileChange} 
                  disabled={isParsing}
                  className="hidden" 
                />
              </div>
              
              {isParsing && (
                 <div className="flex items-center gap-2 text-primary font-medium animate-pulse">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Parsing your memories...</span>
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full shadow-lg overflow-hidden py-0">
          <CardHeader className="bg-muted/30 pb-6 pt-6 border-b">
             <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                   <FileText className="w-5 h-5 text-primary" />
                   Review & Download
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleReset} disabled={isDownloading}>
                  Back
                </Button>
             </div>
             <CardDescription>
                We found {memories.length} memories ready to download.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-4 border border-blue-100 dark:border-blue-900/50">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                       <Film className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground font-medium">Videos</div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{videoCount}</div>
                    </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center gap-4 border border-purple-100 dark:border-purple-900/50">
                    <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                       <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground font-medium">Images</div>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{imageCount}</div>
                    </div>
                </div>
             </div>

             <div className="space-y-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="concurrency" className="font-medium text-yellow-900 dark:text-yellow-100">Download Speed (Concurrency)</Label>
                  <Select value={concurrency} onValueChange={setConcurrency} disabled={isDownloading}>
                    <SelectTrigger id="concurrency" className="w-[140px] h-8 bg-white dark:bg-slate-950">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (Safe)</SelectItem>
                      <SelectItem value="3">3 (Balanced)</SelectItem>
                      <SelectItem value="5">5 (Fast)</SelectItem>
                      <SelectItem value="10">10 (Turbo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300/80">
                  Higher concurrency is faster but uses more memory. Reduce if crashing.
                </p>
             </div>

             {isDownloading && progress && (
               <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span>{Math.round((progress.processed / progress.total) * 100)}%</span>
                 </div>
                 <Progress value={(progress.processed / progress.total) * 100} className="h-2" />
                 <div className="text-xs text-muted-foreground flex justify-between items-center">
                    <span className="truncate max-w-[200px]">{progress.currentFile || 'Initializing...'}</span>
                    <span>{progress.processed} / {progress.total}</span>
                 </div>
               </div>
             )}

             {progress && progress.errors.length > 0 && (
               <Alert variant="destructive" className="max-h-32 overflow-y-auto">
                  <FileWarning className="h-4 w-4" />
                  <AlertTitle>Errors ({progress.errors.length})</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                      <ul className="list-disc pl-4">
                          {progress.errors.map((e, i) => <li key={i}>{e}</li>)}
                      </ul>
                  </AlertDescription>
               </Alert>
             )}
          </CardContent>
          <CardFooter className="bg-muted/30 p-6 border-t flex justify-end">
            {isDownloading ? (
               <Button variant="destructive" onClick={handleCancel} className="w-full sm:w-auto h-12 font-bold shadow-sm">
                  <XCircle className="mr-2 h-5 w-5" /> Stop Download
               </Button>
            ) : (
               <Button 
                  onClick={handleDownload} 
                  disabled={memories.length === 0} 
                  className="w-full sm:w-auto h-12 text-base bg-[#f9f601] text-black hover:bg-[#e5e200] font-bold border-2 border-transparent hover:border-black/10 shadow-sm transition-all"
                >
                  <Download className="mr-2 h-5 w-5" /> Start Download
               </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="w-full text-center shadow-lg border-2 border-green-500 bg-white">
          <CardHeader className="pt-10">
            <div className="mx-auto bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300 ring-4 ring-green-50">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-4xl font-black tracking-tight text-green-700">All Done!</CardTitle>
            <CardDescription className="text-xl mt-3 font-medium text-gray-600">
              Your memories have been successfully downloaded.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 max-w-md mx-auto">
               <p className="text-base text-gray-600 leading-relaxed">
                 The ZIP file has been generated and the download started automatically. 
                 Please check your browser's <span className="font-semibold text-gray-900">Downloads</span> folder.
               </p>
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-10">
            <Button 
                variant="outline" 
                onClick={handleReset} 
                className="gap-2 h-12 px-8 text-base font-bold border-2 hover:bg-gray-50"
            >
              <RefreshCcw className="w-5 h-5" />
              Process Another File
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
