import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SiteLayout } from '@/components/layouts';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-white dark:bg-gray-900')}>
        <SiteLayout>
          {children}
        </SiteLayout>
      </body>
    </html>
  );
}