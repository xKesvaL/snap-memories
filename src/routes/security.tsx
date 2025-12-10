import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock, Github, Globe, ServerOff, Eye, GitCommit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/security')({
  component: SecurityPage,
  head: () => ({
    meta: [
      {
        title: 'Security & Privacy | SnapMemories',
      },
      {
        name: 'description',
        content: 'Learn how SnapMemories protects your data. Client-side processing, direct connections, and open source code verification.',
      },
    ],
  }),
});

function SecurityPage() {
  const commitHash = import.meta.env.VITE_COMMIT_HASH || 'dev';
  const buildTime = import.meta.env.VITE_BUILD_TIME 
    ? new Date(import.meta.env.VITE_BUILD_TIME).toLocaleDateString() 
    : 'Development Build';

  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center mb-12 space-y-4">
        <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-50 dark:ring-green-900/10">
          <ShieldCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Your Data Stays Yours
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          SnapMemories is built with a "Privacy First" architecture. 
          We believe your memories belong to you, and only you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full mb-12">
        <Card className="border-2 border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <ServerOff className="w-10 h-10 text-blue-500 mb-2" />
            <CardTitle className="text-xl">Client-Side Processing</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            All processing happens directly in your web browser. When you select your 
            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-sm mx-1">memories_history.html</code> file, 
            it is read and parsed locally on your device. It is <strong>never</strong> uploaded to any server.
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Lock className="w-10 h-10 text-purple-500 mb-2" />
            <CardTitle className="text-xl">Zero Data Collection</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            We don't track your usage, we don't use cookies for tracking, and we definitely don't see your photos or videos. 
            The download links are generated directly by Snapchat's servers and accessed by your browser.
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 dark:border-orange-900/30 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Github className="w-10 h-10 text-orange-500 mb-2" />
            <CardTitle className="text-xl">100% Open Source</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            Don't just take our word for it. The entire source code for this project is public on GitHub. 
            Security researchers and developers can audit exactly how it works.
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 dark:border-green-900/30 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Globe className="w-10 h-10 text-green-500 mb-2" />
            <CardTitle className="text-xl">Direct Connection</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            Your browser connects directly to Snapchat's AWS (Amazon Web Services) servers to fetch your media. 
            We act only as a tool to organize those requests into a single ZIP file.
          </CardContent>
        </Card>
      </div>

      <div className="w-full mb-12">
         <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-green-600" />
               <h3 className="font-bold text-lg">Don't Trust Us? Verify Yourself.</h3>
            </div>
            <div className="p-6 space-y-6">
               <p className="text-muted-foreground">
                  You are right to be skeptical.
                  <strong> The only way to be 100% sure is to verify it yourself.</strong>
               </p>

               <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                       <div className="bg-slate-100 p-1.5 aspect-square w-8 flex items-center justify-center rounded-md">1</div>
                       Check Network Traffic
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       Open your browser's Developer Tools (F12) and go to the <strong>Network</strong> tab. 
                       You will see that the only external requests being made are to:
                    </p>
                    <ul className="text-sm list-disc pl-5 text-muted-foreground">
                       <li><strong>us-east1-aws.api.snapchat.com</strong> (Snapchat's storage)</li>
                       <li><strong>d2vwf4obepocaj.cloudfront.net</strong> (Snapchat's storage)</li>
                    </ul>
                 </div>

                 <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                       <div className="bg-slate-100 p-1.5 aspect-square w-8 flex items-center justify-center rounded-md">2</div>
                       Run It Locally
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       For the ultimate peace of mind, don't use this hosted website. Clone the code and run it on your own machine.
                    </p>
                    <div className="bg-slate-950 text-slate-50 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                       git clone https://github.com/xKesvaL/snap-memories<br/>
                       cd snap-memories<br/>
                       bun install && bun dev
                    </div>
                 </div>
               </div>
               
               <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                   <p className="text-sm text-muted-foreground mb-3">
                      Current Build Info (Self-Reported):
                   </p>
                   <div className="flex flex-wrap gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg font-mono text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                         <GitCommit className="w-3 h-3" />
                         <a 
                           href={`https://github.com/xKesvaL/snap-memories/commit/${commitHash}`}
                           target="_blank"
                           rel="noreferrer"
                           className="font-bold hover:underline hover:text-primary"
                        >
                           {commitHash}
                        </a>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div>Built: {buildTime}</div>
                   </div>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center w-full">
        <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
          <Eye className="w-6 h-6" />
          Audit the Code
        </h3>
        <p className="text-muted-foreground mb-6 max-w-prose mx-auto">
          We believe transparency is the best security policy. You can inspect the source code 
          to verify that no data leaves your machine.
        </p>
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2 font-semibold hover:bg-black hover:text-white transition-colors"
          onClick={() => window.open('https://github.com/xKesvaL/snap-memories', '_blank')}
        >
          <Github className="w-5 h-5" />
          View on GitHub
        </Button>
      </div>
    </div>
  );
}
