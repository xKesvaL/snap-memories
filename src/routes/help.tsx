import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, FileText, Upload, Settings, Mail, Archive, AlertTriangle, Zap, Server } from 'lucide-react';

export const Route = createFileRoute('/help')({
  component: HelpPage,
  head: () => ({
    meta: [
      {
        title: 'Help & Guide | SnapMemories',
      },
      {
        name: 'description',
        content: 'Step-by-step guide on how to download your Snapchat memories using SnapMemories. Learn how to export your data and use our tool.',
      },
    ],
  }),
});

function HelpPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center mb-12 space-y-4">
        <div className="bg-[#f9f601] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <HelpCircle className="w-10 h-10 text-black" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          How to Use SnapMemories
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A complete step-by-step guide to downloading your Snapchat memories.
        </p>
      </div>

      <div className="grid gap-8 w-full max-w-3xl">
        
        {/* Step 1: Request Data */}
        <div className="relative md:pl-0">
          <div className="hidden md:flex absolute -left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
          
          <Card className="relative border-2 border-slate-100 dark:border-slate-800 shadow-md">
            <div className="hidden md:flex absolute -left-12 top-6 bg-black text-[#f9f601] w-8 h-8 rounded-full items-center justify-center font-bold text-lg shadow-sm z-10">
              1
            </div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#f9f601] font-bold text-lg md:hidden shrink-0">
                  1
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg max-md:hidden">
                  <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-xl md:text-2xl">Request Your Data</CardTitle>
              </div>
              <CardDescription className="text-base">
                You need to request your data export from Snapchat directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Open the <strong>Snapchat app</strong> on your phone or computer.</li>
                <li>Go to <strong>Settings</strong> (the gear icon ⚙️ in the profile).</li>
                <li>Scroll down to the bottom and find <strong>"My Data"</strong>.</li>
                <li>Log in with your Snapchat credentials if asked.</li>
                <li>Ensure <strong>"Memories"</strong> is selected (it usually is by default).</li>
                <li>Enter your email address and click <strong>"Submit Request"</strong>.</li>
              </ol>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50">
                <strong>Note:</strong> Snapchat may take some time to prepare your data. It can range from a few minutes to a few hours depending on how many memories you have.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Download & Extract */}
        <div className="relative md:pl-0">
          <div className="hidden md:flex absolute -left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />

          <Card className="relative border-2 border-slate-100 dark:border-slate-800 shadow-md">
            <div className="hidden md:flex absolute -left-12 top-6 bg-black text-[#f9f601] w-8 h-8 rounded-full items-center justify-center font-bold text-lg shadow-sm z-10">
              2
            </div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#f9f601] font-bold text-lg md:hidden shrink-0">
                  2
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg max-md:hidden">
                  <Mail className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-xl md:text-2xl">Download & Extract</CardTitle>
              </div>
              <CardDescription className="text-base">
                Get the file from your email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Once your data is ready, Snapchat will send you an email with a link.
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Click the link in the email to download the <strong>ZIP file</strong> (e.g., <code>mydata_12345.zip</code>).</li>
                <li>
                    <strong>Unzip/Extract</strong> this file on your computer. 
                    <br/>
                    <span className="text-sm italic">(Right-click the file -&gt; "Extract All" on Windows or double-click on Mac).</span>
                </li>
                <li>Open the extracted folder and navigate to the <strong>html</strong> folder.</li>
                <li>Find the file named <strong>memories_history.html</strong>.</li>
              </ol>
              <div className="flex items-center gap-2 text-xs md:text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 font-mono">
                <FileText className="w-4 h-4" />
                mydata/html/memories_history.html
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 3: Upload & Process */}
        <div className="relative md:pl-0">
          
          <Card className="relative border-2 border-slate-100 dark:border-slate-800 shadow-md">
            <div className="hidden md:flex absolute -left-12 top-6 bg-black text-[#f9f601] w-8 h-8 rounded-full items-center justify-center font-bold text-lg shadow-sm z-10">
              3
            </div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#f9f601] font-bold text-lg md:hidden shrink-0">
                  3
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg  max-md:hidden">
                  <Upload className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </div>
                <CardTitle className="text-xl md:text-2xl">Upload to SnapMemories</CardTitle>
              </div>
              <CardDescription className="text-base">
                Let our tool do the heavy lifting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Go back to the <Link to="/" className="text-primary font-bold hover:underline">Home Page</Link> of this website.
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Click <strong>"Select File"</strong> and choose the <code>memories_history.html</code> you just found.</li>
                <li>The website will scan the file to find all your video and image links.</li>
                <li>Review the number of memories found.</li>
                <li>Click <strong>"Start Download"</strong>.</li>
              </ol>
              <p>
                The tool will download each memory one by one and package them into a new ZIP file for you.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-20 w-full max-w-4xl">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How It Works Precisely</h2>
            <p className="text-muted-foreground">Understanding the technical process behind the scenes.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-slate-100 dark:border-slate-800">
                <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle>1. Parsing</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>
                        Your <code>memories_history.html</code> contains a list of every memory you've saved. 
                        Each entry has a date, type (Image/Video), and a download link. 
                        Our tool reads this file using your browser's built-in HTML parser to extract these links.
                    </p>
                </CardContent>
            </Card>

            <Card className="border-2 border-slate-100 dark:border-slate-800">
                <CardHeader>
                     <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                        <Server className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle>2. Fetching</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>
                        Once the links are extracted, your browser makes direct requests to Snapchat's AWS servers (where the files are stored).
                        We use a "Proxy" technique or direct fetch (depending on current configuration) to bypass browser security restrictions (CORS) that usually prevent this.
                    </p>
                </CardContent>
            </Card>

            <Card className="border-2 border-slate-100 dark:border-slate-800">
                <CardHeader>
                     <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <Archive className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle>3. Zipping</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>
                        As files are downloaded, they are immediately streamed into a ZIP file being created in your computer's memory. 
                        We use a smart streaming technique so we don't have to hold all your gigabytes of data in RAM at once.
                    </p>
                </CardContent>
            </Card>

            <Card className="border-2 border-slate-100 dark:border-slate-800">
                <CardHeader>
                     <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle>Limitations</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>
                        Since this runs in your browser:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li>You must keep the tab open.</li>
                        <li>It depends on your internet speed.</li>
                        <li>Very large collections (10GB+) might need to be downloaded in batches or require a computer with more RAM.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <Link to="/">
            <Button size="lg" className="bg-[#f9f601] text-black hover:bg-[#e5e200] font-bold text-lg px-8 h-14">
                I'm Ready, Let's Start
            </Button>
        </Link>
      </div>

    </div>
  );
}
