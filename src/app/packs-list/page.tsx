// src/app/packs-list/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Box, Gift, Star } from "lucide-react";

const freePlugins = "Gala SE, Randomidi Free, Spacelifter 3, Bjorn, Monica 3, ScandiClavia 2, Mini Ringo, Bonnie, Solina2k, Majoris Free, Anytext, Djup, Midmid, Quentin, 999Gen2, Kitton 3, Saxophia gen2, Rebellion, Tropicana Fun, Bella, Blue Lue";

const maxPackPlugins = "Callisto, Zoe 2, Ringo, AnyImage, Playlisted 2, Kitton Stylist, Ziggi, Gala XL, Randomidi XL, Brunetta, Majoris, Scandisoul 2, Yowlseq 2, Midimotor, Midisquid, Arpomaniac, Yogi, Rythmos, Tropicana";

const madMidiMachinesPlugins = "Betelgeuse, Truculentus";

export default function PacksListPage() {
  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <header className="text-center mb-12">
        <List className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold text-primary">Plugin Packs List</h1>
        <p className="text-lg text-foreground/80 mt-2">Discover what's inside each of our bundles.</p>
      </header>

      <div className="space-y-8 max-w-4xl mx-auto">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-secondary/30">
            <CardTitle className="flex items-center gap-3 font-headline text-2xl text-secondary-foreground">
              <Gift className="h-8 w-8" />
              Free Pack
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-foreground/90 leading-relaxed">
              {freePlugins}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
              <Star className="h-8 w-8" />
              Max! Pack
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-foreground/90 leading-relaxed">
              {maxPackPlugins}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-secondary/30">
            <CardTitle className="flex items-center gap-3 font-headline text-2xl text-secondary-foreground">
              <Box className="h-8 w-8" />
              Mad MIDI Machines Pack
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-foreground/90 leading-relaxed">
              {madMidiMachinesPlugins}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
