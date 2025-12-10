import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Coffee, Server, Github, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/donate')({
  component: DonatePage,
  head: () => ({
    meta: [
      {
        title: 'Support SnapMemories | Donate',
      },
      {
        name: 'description',
        content: 'SnapMemories is 100% free and open source. Support the project and help cover server costs by buying us a coffee.',
      },
    ],
  }),
});

function DonatePage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center mb-12 space-y-4">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-yellow-50 dark:ring-yellow-900/10">
          <Heart className="w-10 h-10 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Support SnapMemories
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          100% Free. 100% Open Source. Powered by you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full mb-12">
        <Card className="border-2 border-slate-100 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <Check className="w-8 h-8 text-green-500 mb-2" />
            <CardTitle className="text-lg">Forever Free</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            We believe you shouldn't have to pay to access your own data. SnapMemories will always be free to use for everyone.
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-100 dark:border-slate-800 shadow-sm">
           <CardHeader>
            <Github className="w-8 h-8 text-slate-900 dark:text-slate-100 mb-2" />
            <CardTitle className="text-lg">Open Source</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Our code is public and transparent. We develop in the open because we have nothing to hide.
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-100 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <Server className="w-8 h-8 text-blue-500 mb-2" />
            <CardTitle className="text-lg">Community Supported</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            We don't run ads or sell data. We rely on the generosity of users like you to keep the servers running.
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-yellow-400/30 shadow-xl text-center max-w-2xl w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300" />
        
        <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
          <Coffee className="w-6 h-6 text-orange-600" />
          Buy us a Coffee
        </h3>
        <p className="text-muted-foreground mb-8 text-lg">
          If this tool helped you save your precious memories, please consider donating. 
          Your support helps cover domain and hosting costs.
        </p>
        
        <Button 
          size="lg" 
          className="gap-2 font-bold text-lg h-14 px-8 bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90 shadow-lg hover:translate-y-[-2px] transition-all"
          onClick={() => window.open('https://buymeacoffee.com/kesvalstudio', '_blank')}
        >
          <Coffee className="w-5 h-5" />
          Support on Buy Me a Coffee
        </Button>
      </div>
    </div>
  );
}
