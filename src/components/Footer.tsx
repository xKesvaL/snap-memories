import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-sm text-muted-foreground border-t border-black/5 mt-auto bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-center gap-1">
        <span>Made with</span>
        <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
        <span>by</span>
        <a 
          href="https://kesval.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-semibold text-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-4 hover:decoration-solid"
        >
          KesvaL Studio
        </a>
      </div>
    </footer>
  );
}

