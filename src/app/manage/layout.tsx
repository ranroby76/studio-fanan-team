// src/app/manage/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Edit, Package, Settings, ImageIcon, X } from 'lucide-react';
import type React from 'react';

const manageNavLinks = [
  { href: '/manage/gui-me-editor', label: 'GUI ME EDITOR', icon: Edit },
  { href: '/manage/logos', label: 'Logos', icon: ImageIcon },
  { href: '/manage/products', label: 'Products', icon: Package },
];

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Adjust active link logic for paths like /manage/products/add or /manage/products/edit/[id]
  const isActive = (baseHref: string, currentPath: string) => {
    if (baseHref === currentPath) return true;
    // Check if currentPath starts with baseHref AND baseHref is not a generic starting point like '/'
    if (currentPath.startsWith(baseHref) && baseHref !== '/' && baseHref.length > 1) {
      // More specific check for /manage/products to avoid matching /manage/products-something-else
      if (baseHref === '/manage/products' && (currentPath.startsWith('/manage/products/add') || currentPath.startsWith('/manage/products/edit/'))) {
        return true;
      }
       if (baseHref === '/manage/gui-me-editor' && currentPath === '/manage/gui-me-editor') return true;
       if (baseHref === '/manage/logos' && currentPath === '/manage/logos') return true;
       // For other items, simple startsWith is fine
       if (baseHref !== '/manage/products' && baseHref !== '/manage/gui-me-editor' && baseHref !== '/manage/logos') return true;
    }
    return false;
  };


  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-theme(spacing.32))]">
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
                         isActive(link.href, pathname)
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
        <main className="flex-1 overflow-y-auto relative">
           <Button variant="ghost" size="icon" asChild className="absolute top-0 right-0 z-10 text-muted-foreground hover:text-foreground">
            <Link href="/" aria-label="Close management section">
              <X className="h-6 w-6" />
            </Link>
          </Button>
          {children}
        </main>
      </div>
    </div>
  );
}
