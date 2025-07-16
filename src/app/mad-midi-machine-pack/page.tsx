// src/app/mad-midi-machine-pack/page.tsx
import ProductPackPage from '@/components/product/ProductPackPage';
import type { Pack } from '@/lib/types';

export default function MadMidiMachinesPackPage() {
  const packName: Pack = "Mad MIDI Machines Pack";
  return <ProductPackPage pack={packName} />;
}
