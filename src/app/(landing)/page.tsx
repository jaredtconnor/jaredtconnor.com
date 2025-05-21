import { Metadata } from 'next';
import Hero from '@/app/(landing)/components/Hero';
import ProjectsSection from '@/app/(landing)/components/ProjectsSection';
import Contact from '@/app/(landing)/components/Contact';
import { HOME } from './const';

export const metadata: Metadata = {
  title: HOME.TITLE,
  description: HOME.DESCRIPTION,
};

export default function HomePage() {
  return (
    <> 
    <Hero /> 
    <ProjectsSection />
    <Contact />
    </>
  );
}