import { PageTransition } from "@/src/components/templates/PageTransition";
import { SmoothScrollWrapper } from "@/src/components/templates/SmoothScrollWrapper";
import { ScrollProgressBar } from "@/src/components/atoms/ScrollProgressBar";
import { Header } from "@/src/components/organisms/Header";
import { MasonryGallery } from "@/src/components/organisms/MasonryGallery";
import { Bio } from "@/src/components/organisms/Bio";
import { ContactForm } from "@/src/components/organisms/ContactForm";
import { Footer } from "@/src/components/organisms/Footer";

export default function Home() {
  return (
    <PageTransition>
      <SmoothScrollWrapper>
        <ScrollProgressBar />
        <Header />
        <main>
          <MasonryGallery />
          <Bio />
          <ContactForm />
        </main>
        <Footer />
      </SmoothScrollWrapper>
    </PageTransition>
  );
}
