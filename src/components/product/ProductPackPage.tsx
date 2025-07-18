// src/components/product/ProductPackPage.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { formatTags } from '@/lib/product-service';
import type { Product, Pack } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PackageSearch, Star, Box, Gift, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


interface ProductPackPageProps {
  pack: Pack;
  initialProducts: Product[];
}

const packConfig: Record<Pack, { logo: string, href: string, title: string, icon: React.ElementType }> = {
  "Max! Pack": { logo: "/images/pro pack.png", href: "/max-pack", title: "Max! Pack", icon: Star },
  "Mad MIDI Machines Pack": { logo: "/images/mad midi machines.png", href: "/mad-midi-machine-pack", title: "Mad MIDI Machines", icon: Box },
  "Free Pack": { logo: "/images/free pack.png", href: "/free-pack", title: "Free Pack", icon: Gift },
};


export default function ProductPackPage({ pack, initialProducts }: ProductPackPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false); // Initial data is now passed in
  const pathname = usePathname();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);


  return (
    <div className="container mx-auto px-4 animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start my-8">
        {/* Pack Selector Sidebar */}
        <aside className="w-full md:w-56">
           <Card className="shadow-md">
            <CardHeader className="p-3 border-b">
                <CardTitle className="text-xl font-headline text-primary flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Our Packs
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
                <nav className="flex flex-col space-y-1">
                    {(Object.values(packConfig) as (typeof packConfig)[Pack][]).map(p => (
                         <Button
                            key={p.href}
                            variant="ghost"
                            asChild
                            className={cn(
                                "w-full justify-start text-left h-auto py-2.5 px-3",
                                pathname === p.href
                                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                                : "hover:bg-muted/50"
                            )}
                        >
                            <Link href={p.href} className="flex items-center w-full">
                                <p.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                <span className="truncate">{p.title}</span>
                            </Link>
                        </Button>
                    ))}
                </nav>
            </CardContent>
           </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
            <div className="flex justify-center mb-8">
                <div className="w-full max-w-lg h-auto">
                    {packConfig[pack] && (
                        <Image 
                        src={packConfig[pack].logo} 
                        alt={`${pack} Logo`} 
                        width={750} 
                        height={120} 
                        className="object-contain"
                        priority
                        />
                    )}
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Loading {pack} products...</p>
                </div>
            ) : products.length === 0 ? (
                <Card className="text-center py-12 shadow-lg max-w-lg mx-auto">
                <CardHeader>
                    <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <CardTitle className="text-2xl font-headline text-primary">No Products Here Yet</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-lg text-foreground/80">
                    There are currently no products listed in the {pack}.
                    </CardDescription>
                </CardContent>
                </Card>
            ) : (
                <div className="columns-1 md:columns-2 gap-8 space-y-8">
                {products.map(product => (
                    <Card key={product.id} className="group flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-card break-inside-avoid">
                    <Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="flex flex-col">
                        <div className="relative overflow-hidden bg-muted">
                        {product.mainImage?.url && product.mainImage.width && product.mainImage.height ? (
                            <Image
                            src={product.mainImage.url}
                            alt={product.title}
                            width={product.mainImage.width}
                            height={product.mainImage.height}
                            className="object-contain w-full h-auto p-2 group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint="instrument audio"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
                            No Image
                            </div>
                        )}
                        </div>
                        <CardHeader className="flex-grow p-4">
                        <CardTitle className="text-xl font-bold font-headline text-primary truncate group-hover:text-accent transition-colors">
                            {product.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-foreground/80 h-10 line-clamp-2">
                            {product.shortDescription}
                        </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-3 border-t bg-muted/30 mt-auto">
                        <p className="text-base text-muted-foreground text-center truncate w-full">{formatTags(product.formats)}</p>
                        </CardFooter>
                    </Link>
                    </Card>
                ))}
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
