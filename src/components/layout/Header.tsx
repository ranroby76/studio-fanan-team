// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { Music2, Home, Mail, VenetianMask, HelpCircle, ShoppingCart, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/contact-us', label: 'Contact Us', icon: Mail },
  { href: '/gui-me', label: 'GUI Me', icon: VenetianMask },
  { href: '/how-to-buy', label: 'How to Buy', icon: HelpCircle },
  { href: '/buy-now', label: 'Buy Now', icon: ShoppingCart },
  { href: '/manage', label: 'Manage Products', icon: Settings },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 mb-4 sm:mb-0">
          <Music2 size={32} className="transform group-hover:rotate-12 transition-transform duration-300" />
          <h1 className="text-2xl font-headline font-bold">Fanan Team Hub</h1>
        </Link>
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {navLinks.map(({ href, label, icon: Icon }) => (
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
        </nav>
      </div>
    </header>
  );
}
