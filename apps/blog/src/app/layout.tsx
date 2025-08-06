import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SiteLayout } from '@/components/layouts';
import { GlobalNavigationProvider } from '@/components/providers';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Jared Connor',
  description: 'Developer, data engineer, and financial analyst. Building scalable systems and exploring the intersection of data, finance, and technology.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'antialiased')}>
        <GlobalNavigationProvider>
          <SiteLayout>
            {children}
          </SiteLayout>
        </GlobalNavigationProvider>
      </body>
    </html>
  );
}