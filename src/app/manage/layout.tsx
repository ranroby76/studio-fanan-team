// src/app/manage/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Edit, Package, Box, Settings } from 'lucide-react';
import type React from 'react';

const manageNavLinks = [
  { href: '/manage/gui-me-editor', label: 'GUI ME EDITOR', icon: Edit },
  { href: '/manage/products', label: 'Products', icon: Package },
  { href: '/manage/item-3', label: 'Item 3', icon: Box },
  { href: '/manage/item-4', label: 'Item 4', icon: Box },
  { href: '/manage/item-5', label: 'Item 5', icon: Box },
  { href: '/manage/item-6', label: 'Item 6', icon: Box },
  { href: '/manage/item-7', label: 'Item 7', icon: Box },
  { href: '/manage/item-8', label: 'Item 8', icon: Box },
  { href: '/manage/item-9', label: 'Item 9', icon: Box },
  { href: '/manage/item-10', label: 'Item 10', icon: Box },
];

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-theme(spacing.32))]">
      <aside className="w-full md:w-64">
        <Card className="shadow-lg h-full">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 p-3 border-b mb-2">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-headline font-semibold text-primary">Management</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-theme(spacing.56))] md:h-auto"> {/* Adjust height as needed */}
              <nav className="flex flex-col space-y-1">
                {manageNavLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "w-full justify-start text-left h-auto py-2.5 px-3",
                      pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/manage/gui-me-editor' && link.href !== '/manage/products' && pathname.includes('edit')) // Special handling for edit/add under products
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
  );
}
