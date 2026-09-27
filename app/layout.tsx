import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { Footer } from '@/components/shared/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Tourist Safety Monitoring & Incident Response System',
  description: 'Explore freely. Stay protected intelligently. Smart City Kolkata Tourist Safety Platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-navy-950 text-slate-100 flex flex-col`}>
        <Navbar />
        <DemoBanner />
        <ToastContainer />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
