'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/app/(landing)/const';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="py-6 mb-12"> 
    <div>Header</div>
    </header>
  );
}