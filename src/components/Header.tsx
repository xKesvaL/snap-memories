import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  Home,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [parent] = useAutoAnimate()

  return (
    <>
      <header className="bg-[#f9f601] text-black border-b border-black/10 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/snapchat.svg"
                alt="Snapchat Logo"
                className="h-8 w-8"
              />
              <span className="font-bold tracking-tight">SnapMemories</span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-medium">
             <Link to="/" className="hover:text-black/70 transition-colors">Home</Link>
             <Link to="/security" className="flex items-center gap-1.5 hover:text-black/70 transition-colors">
                <ShieldCheck className="w-4 h-4" />
                Security
             </Link>
             <a 
               href="https://github.com/xKesvaL/snap-memories" 
               target="_blank" 
               rel="noopener noreferrer"
               className="hover:text-black/70 transition-colors"
             >
               GitHub
             </a>
          </nav>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors md:hidden text-black"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
        ref={parent}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-black bg-[#f9f601] text-black">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-black/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto bg-white">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f9f601] text-black transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-[#f9f601] hover:bg-[#f9f601] transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/security"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f9f601] text-black transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-[#f9f601] hover:bg-[#f9f601] transition-colors mb-2',
            }}
          >
            <ShieldCheck size={20} />
            <span className="font-medium">Security</span>
          </Link>
          
          <a
            href="https://github.com/xKesvaL/snap-memories"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f9f601] text-black transition-colors mb-2"
          >
            <img src="https://github.com/favicon.ico" alt="GitHub" className="w-5 h-5 grayscale" />
            <span className="font-medium">GitHub</span>
          </a>
        </nav>
      </aside>
    </>
  )
}
