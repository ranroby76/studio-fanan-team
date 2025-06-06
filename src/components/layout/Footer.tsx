// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p className="text-sm">&copy; {new Date().getFullYear()} Fanan Team Hub. All rights reserved.</p>
        <p className="text-xs mt-1">Designed with passion for music creators.</p>
      </div>
    </footer>
  );
}
