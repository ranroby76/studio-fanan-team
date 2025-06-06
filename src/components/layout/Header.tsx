// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Music2, Home, Mail, VenetianMask, HelpCircle, ShoppingCart, Settings, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { FirmLogosData } from '@/lib/types';
import { getLogosContent } from '@/lib/logo-service';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/contact-us', label: 'Contact Us', icon: Mail },
  { href: '/gui-me', label: 'GUI Me', icon: VenetianMask },
  { href: '/how-to-buy', label: 'How to Buy', icon: HelpCircle },
  { href: '/buy-now', label: 'Buy Now', icon: ShoppingCart },
  { href: '/manage', label: 'Manage Site', icon: Settings }, // Changed label for clarity
];

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [firmLogos, setFirmLogos] = useState<FirmLogosData | null>(null);

  useEffect(() => {
    setMounted(true);
    setFirmLogos(getLogosContent());
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Original size: 562x244. Aspect ratio: 562/244 = 2.303
  // Target height for header: ~36px
  // Target width: 36 * 2.303 = ~83px
  const logoDisplayWidth = 83;
  const logoDisplayHeight = 36;

  return (
    <header className="bg-card border-b shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity duration-300 mb-4 sm:mb-0"
          aria-label="Fanan Team Home"
        >
          {firmLogos?.firmLogoUrl ? (
            <Image 
              src={firmLogos.firmLogoUrl} 
              alt="Fanan Team Logo" 
              width={logoDisplayWidth} 
              height={logoDisplayHeight}
              priority // Prioritize loading the logo
            />
          ) : (
            <>
              <Music2 size={32} className="transform group-hover:rotate-12 transition-transform duration-300" />
              <h1 className="text-2xl font-headline font-bold">Fanan Team Hub</h1>
            </>
          )}
        </Link>
        <nav className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors duration-300 hover:text-primary hover:bg-primary/10",
              (pathname === href || (href === '/manage' && pathname.startsWith('/manage'))) 
                ? "text-primary bg-primary/10 font-semibold" 
                : "text-foreground/70"
            )}>
              <Link href={href} className="flex items-center gap-2 px-3 py-2 rounded-md">
                <Icon size={18} />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">{label.split(' ')[0]}</span>
              </Link>
            </Button>
          ))}
           {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-foreground/70 hover:text-primary hover:bg-primary/10"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          )}
          {!mounted && (
             <Button variant="ghost" size="icon" className="h-9 w-9" disabled /> // Placeholder for SSR
          )}
        </nav>
      </div>
    </header>
  );
}
