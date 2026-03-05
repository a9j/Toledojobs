import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen font-body">
      <Navbar />

      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
