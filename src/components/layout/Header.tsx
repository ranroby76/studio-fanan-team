// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Music2, Home, Mail, VenetianMask, HelpCircle, ShoppingCart, Settings, Sun, Moon, Loader2, Package, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { FirmLogosData } from '@/lib/types';
import { getLogosContent } from '@/lib/logo-service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/gui-me', label: 'GUI Me', icon: VenetianMask },
  { href: '/how-to-buy', label: 'How to Buy', icon: HelpCircle },
  { href: '/buy-now', label: 'Buy Now', icon: ShoppingCart },
  { href: '/contact-us', label: 'Contact Us', icon: Mail },
];

const productLinks = [
    { href: '/pro-pack', label: 'Pro Pack' },
    { href: '/mad-midi-machine-pack', label: 'Mad MIDI Machines' },
    { href: '/free-pack', label: 'Free Pack' },
];

const homeLink = mainNavLinks.find(link => link.href === '/');
const otherNavLinks = mainNavLinks.filter(link => link.href !== '/');


export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [firmLogos, setFirmLogos] = useState<FirmLogosData | null>(null);
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadLogos() {
      setIsLoadingLogos(true);
      try {
        const logos = await getLogosContent();
        setFirmLogos(logos);
      } catch (error) {
        console.error("Failed to load firm logos for header:", error);
      } finally {
        setIsLoadingLogos(false);
      }
    }
    loadLogos();
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const logoDisplayWidth = 166;
  const logoDisplayHeight = 72;

  const firmLogoPath = firmLogos?.firmLogoUrl ? `/images/${firmLogos.firmLogoUrl}` : '';
  
  return (
    <header className="bg-card border-b shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity duration-300 mb-4 sm:mb-0 min-h-[72px]"
          aria-label="Fanan Team Home"
        >
          {isLoadingLogos ? (
            <div style={{ width: `${logoDisplayWidth}px`, height: `${logoDisplayHeight}px` }} className="flex items-center justify-center">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : firmLogoPath ? (
            <Image 
              src={firmLogoPath} 
              alt="Fanan Team Logo" 
              width={logoDisplayWidth} 
              height={logoDisplayHeight}
              className="object-contain"
              priority 
            />
          ) : (
            <>
              <Music2 size={32} className="transform group-hover:rotate-12 transition-transform duration-300" />
              <h1 className="text-2xl font-headline font-bold">Fanan Team Hub</h1>
            </>
          )}
        </Link>
        <nav className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
          {homeLink && (
             <Button key={homeLink.href} variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors duration-300 hover:text-primary hover:bg-primary/10",
              pathname === homeLink.href ? "text-primary bg-primary/10 font-semibold" : "text-foreground/70"
            )}>
              <Link href={homeLink.href} className="flex items-center gap-2 px-3 py-2 rounded-md">
                <homeLink.icon size={18} />
                <span className="hidden md:inline">{homeLink.label}</span>
                <span className="md:hidden">{homeLink.label.split(' ')[0]}</span>
              </Link>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                    "text-sm font-medium transition-colors duration-300 hover:text-primary hover:bg-primary/10",
                    productLinks.some(link => pathname.startsWith(link.href)) ? "text-primary bg-primary/10 font-semibold" : "text-foreground/70"
                )}>
                    <Package size={18} />
                    <span className="hidden md:inline ml-2">Products</span>
                    <span className="md:hidden">Products</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {productLinks.map(({ href, label }) => (
                    <DropdownMenuItem key={href} asChild>
                        <Link href={href}>{label}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {otherNavLinks.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors duration-300 hover:text-primary hover:bg-primary/10",
              pathname === href ? "text-primary bg-primary/10 font-semibold" : "text-foreground/70"
            )}>
              <Link href={href} className="flex items-center gap-2 px-3 py-2 rounded-md">
                <Icon size={18} />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">{label.split(' ')[0]}</span>
              </Link>
            </Button>
          ))}

          <Button variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors duration-300 hover:text-primary hover:bg-primary/10",
              pathname.startsWith('/manage') ? "text-primary bg-primary/10 font-semibold" : "text-foreground/70"
            )}>
              <Link href="/manage" className="flex items-center gap-2 px-3 py-2 rounded-md">
                <Settings size={18} />
                <span className="hidden md:inline">Manage Site</span>
                <span className="md:hidden">Manage</span>
              </Link>
          </Button>

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
             <Button variant="ghost" size="icon" className="h-9 w-9" disabled /> 
          )}
        </nav>
      </div>
    </header>
  );
}
