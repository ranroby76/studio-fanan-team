// src/app/manage/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Edit, Package, Settings, ImageIcon, X, ListOrdered } from 'lucide-react';
import type React from 'react';

const manageNavLinks = [
  { href: '/manage/products-order', label: 'Products Order', icon: ListOrdered },
  { href: '/manage/products', label: 'Products', icon: Package },
  { href: '/manage/gui-me-editor', label: 'GUI ME Editor', icon: Edit },
  { href: '/manage/logos', label: 'Logos', icon: ImageIcon },
];

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (baseHref: string) => {
    // Special handling for the "Products" tab to include its sub-pages (add/edit).
    if (baseHref === '/manage/products') {
      return pathname === '/manage/products' || pathname.startsWith('/manage/add') || pathname.startsWith('/manage/edit/');
    }
    // For all other links, we require an exact match.
    return pathname === baseHref;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="relative flex flex-col md:flex-row gap-6 min-h-[calc(100vh-theme(spacing.32))]">
        <Button variant="ghost" size="icon" asChild className="absolute top-0 right-0 z-10 text-muted-foreground hover:text-foreground">
            <Link href="/" aria-label="Close management section">
              <X className="h-6 w-6" />
            </Link>
        </Button>
        
        <aside className="w-full md:w-64">
          <Card className="shadow-lg h-full">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 p-3 border-b mb-2">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-headline font-semibold text-primary">Management</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-theme(spacing.56))] md:h-auto">
                <nav className="flex flex-col space-y-1">
                  {manageNavLinks.map((link) => (
                    <Button
                      key={link.href}
                      variant="ghost"
                      asChild
                      className={cn(
                        "w-full justify-start text-left h-auto py-2.5 px-3",
                         isActive(link.href)
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <Link href={link.href} className="flex items-center w-full">
                        <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </Link>
                    </Button>
                  ))}
                </nav>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
