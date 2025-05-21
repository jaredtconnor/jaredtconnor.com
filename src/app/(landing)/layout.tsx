import Header from '@/app/(landing)/components/Header';
import Footer from '@/app/(landing)/components/Footer';
import { SITE } from '@/app/(landing)/const';

type Props = {
  title: string;
  description: string;
};

const { title, description } = Astro.props;

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( 
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 