'use client';

import { Leaf, LogIn, LogOut, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

function UserNav() {
  const { user } = useUser();
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <Button asChild variant="ghost">
        <Link href="/login">
          <LogIn className="mr-2" />
          Login
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{user.displayName?.[0] ?? user.email?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  return (
    <header className="p-4 border-b bg-card">
      <div className="container mx-auto flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary transition-opacity hover:opacity-80">
          <Leaf className="w-6 h-6" />
          <h1 className="font-headline">VisionTrack</h1>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
           <Button variant="ghost" asChild>
             <Link href="/tutorial">
                <BookOpen className="mr-2" />
                Tutorial
             </Link>
           </Button>
          <UserNav />
        </nav>
      </div>
    </header>
  );
}
