// src/app/products/[slug]/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product, ImageDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, ServerCrash, Download, ShoppingCart, Info, Youtube, Circle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { getProductBySlug } from '@/lib/product-service-server';
import type { Metadata, ResolvingMetadata } from 'next';

// This component fetches and sets metadata for the page.
// NOTE: We cannot use the "use client" directive here because generateMetadata is a server-only function.
// So we will have a separate client component for the page content.
type Props = {
  params: { slug: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const product = await getProductBySlug(slug);
 
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: {
      title: `${product.title} | Fanan Team`,
      description: product.shortDescription,
      images: [product.mainImage.url, ...previousImages],
    },
  }
}

const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('v');
        }
        return null;
    } catch (e) {
        return null;
    }
}

const renderDescription = (description: string) => {
    return description.split('\\n').map((line, index) => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('##')) {
            return (
                <h3 key={index} className="text-xl font-headline text-primary mt-4 mb-2">
                    {trimmedLine.substring(2).trim()}
                </h3>
            );
        }
        if (trimmedLine.startsWith('#')) {
            return (
                <div key={index} className="flex items-start gap-3 my-1.5">
                    <Circle className="h-2 w-2 mt-[7px] flex-shrink-0 text-primary/70 fill-current" />
                    <p className="text-foreground/80">{trimmedLine.substring(1).trim()}</p>
                </div>
            );
        }
        if (trimmedLine) {
            return (
                 <p key={index} className="text-foreground/80 my-2">
                    {trimmedLine}
                 </p>
            );
        }
        return <br key={index} />;
    });
};

function ProductPageContent() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : undefined;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
        if (slug) {
          try {
            // This is now an async server action call
            const foundProduct = await getProductBySlug(slug);
            if (foundProduct) {
              setProduct(foundProduct);
              if (foundProduct.mainImage && foundProduct.mainImage.url) {
                setSelectedImage(foundProduct.mainImage);
              }
            } else {
              notFound();
            }
          } catch (e) {
            console.error("Failed to load product", e);
            notFound();
          } finally {
            setIsLoading(false);
          }
        } else {
            setIsLoading(false);
        }
    }
    loadProduct();
  }, [slug]);

  const packImages: Record<Product['pack'], string> = {
    "Max! Pack": "/images/pro pack.png",
    "Mad MIDI Machines Pack": "/images/mad midi machines.png",
    "Free Pack": "/images/free pack.png",
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 animate-fade-in space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-16 w-2/3 mx-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                 <Skeleton className="w-full aspect-video" />
                 <div className="flex gap-2 mt-2">
                    <Skeleton className="h-20 w-20" />
                    <Skeleton className="h-20 w-20" />
                    <Skeleton className="h-20 w-20" />
                 </div>
            </div>
            <div className="lg:col-span-2">
                 <Skeleton className="h-96 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
        <Card className="max-w-md mx-auto mt-10 shadow-lg border-destructive">
            <CardHeader className="bg-destructive/10">
                <CardTitle className="flex items-center gap-3 font-headline text-destructive">
                    <ServerCrash /> Product Not Found
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <p className="text-center">The product you are looking for does not exist.</p>
            </CardContent>
        </Card>
    );
  }

  const allImages = [product.mainImage, ...product.thumbnails].filter(img => img && img.url) as ImageDetails[];
  const rawVideoIds = product.videoUrls?.map(getYouTubeVideoId).filter((id): id is string => !!id) || [];
  const uniqueVideoIds = [...new Set(rawVideoIds)];

  return (
    <div className="container mx-auto px-4 animate-fade-in">
       <div className="flex justify-center mb-4">
          <div className="w-96 h-auto">
            <Image src={packImages[product.pack]} alt={`${product.pack} logo`} width={600} height={120} className="object-contain" />
          </div>
      </div>
      <h1 className="text-5xl font-bold font-headline text-primary mb-8 text-center">{product.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card className="shadow-lg overflow-hidden">
             {selectedImage && selectedImage.url && selectedImage.width && selectedImage.height ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="block relative w-full bg-muted cursor-zoom-in">
                      <Image
                        src={selectedImage.url}
                        alt={`Main view of ${product.title}`}
                        width={selectedImage.width}
                        height={selectedImage.height}
                        className="object-contain p-2 w-full h-auto"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                        priority
                      />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[85vw] h-[85vh] max-w-[85vw] max-h-[85vh] p-2 flex justify-center items-center">
                     <DialogHeader>
                        <DialogTitle className="sr-only">Full-size view of {product.title}</DialogTitle>
                     </DialogHeader>
                     <Image
                        src={selectedImage.url}
                        alt={`Full-size view of ${product.title}`}
                        width={selectedImage.width}
                        height={selectedImage.height}
                        className="object-contain rounded-md w-auto h-full max-w-full max-h-full"
                      />
                  </DialogContent>
                </Dialog>
            ) : (
                <div className="w-full aspect-video bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                </div>
            )}
            {allImages.length > 1 && (
              <div className="p-2 bg-background border-t">
                <div className="flex gap-2 justify-center flex-wrap">
                  {allImages.map((thumb, index) => (
                    thumb.url && (
                     <button 
                        key={index} 
                        onClick={() => setSelectedImage(thumb)}
                        className={`relative h-20 w-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${selectedImage?.url === thumb.url ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'}`}
                      >
                       <Image
                          src={thumb.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                     </button>
                    )
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">About this Plugin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>{renderDescription(product.description)}</div>
                    
                    <Separator />
                    
                    <div className="text-center">
                        <p className="text-4xl font-bold text-accent">
                            {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Free'}
                        </p>
                    </div>

                    {product.price > 0 && product.demoLimitations && (
                        <div className="bg-secondary/30 p-3 rounded-lg text-center">
                            <h4 className="font-semibold text-secondary-foreground flex items-center justify-center gap-2"><Info size={16}/>Demo Limitations</h4>
                            <p className="text-sm text-secondary-foreground/80">{product.demoLimitations}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        {product.downloadLinks.map(link => (
                             <Button key={link.id} asChild className="w-full">
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2" /> {link.label}
                                </a>
                            </Button>
                        ))}
                    </div>

                    {product.price > 0 && (
                        <Button onClick={() => router.push('/buy-now')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6">
                            <ShoppingCart className="mr-2" /> Buy Now
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
       {uniqueVideoIds.length > 0 && (
        <section className="mt-12">
            <h2 className="text-3xl font-headline text-primary mb-4 text-center flex items-center justify-center gap-3"><Youtube /> Videos</h2>
            <div className="flex flex-col items-center gap-6">
                {uniqueVideoIds.map((videoId, index) => (
                    <div key={`${videoId}-${index}`} className="w-full md:w-3/4 aspect-video rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ))}
            </div>
        </section>
      )}

    </div>
  );
}


export default function ProductPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 animate-fade-in space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-16 w-2/3 mx-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                 <Skeleton className="w-full aspect-video" />
                 <div className="flex gap-2 mt-2">
                    <Skeleton className="h-20 w-20" />
                    <Skeleton className="h-20 w-20" />
                    <Skeleton className="h-20 w-20" />
                 </div>
            </div>
            <div className="lg:col-span-2">
                 <Skeleton className="h-96 w-full" />
            </div>
        </div>
      </div>}>
      <ProductPageContent />
    </Suspense>
  );
}
