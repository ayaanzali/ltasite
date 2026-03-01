import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Events } from "@/components/Events";
import { Officers } from "@/components/Officers";
import { WhyJoin } from "@/components/WhyJoin";
import { GetInvolved } from "@/components/GetInvolved";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Gallery />
      <Events />
      <WhyJoin />
      <Officers />
      <GetInvolved />
      <Footer />
    </main>
  );
}
