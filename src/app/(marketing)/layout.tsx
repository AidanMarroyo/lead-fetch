import Footer from '@/components/marketing/Footer';
import Navbar from '@/components/marketing/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
