import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="p-4 border-b bg-card">
      <div className="container mx-auto flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary transition-opacity hover:opacity-80">
          <Leaf className="w-6 h-6" />
          <h1 className="font-headline">VisionTrack</h1>
        </Link>
      </div>
    </header>
  );
}
