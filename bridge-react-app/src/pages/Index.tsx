import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TokenShowcase } from "@/components/TokenShowcase";
import { CreateToken } from "@/components/CreateToken";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <TokenShowcase />
        <CreateToken />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
