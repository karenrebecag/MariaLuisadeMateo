import { Suspense } from "react";
import { PageTransition } from "@/src/components/templates/PageTransition";
import { SmoothScrollWrapper } from "@/src/components/templates/SmoothScrollWrapper";
import { ScrollProgressBar } from "@/src/components/atoms/ScrollProgressBar";
import { Header } from "@/src/components/organisms/Header";
import { AdaptiveGallery } from "@/src/components/organisms/AdaptiveGallery";
import { Bio } from "@/src/components/organisms/Bio";
import { AvailableWorks } from "@/src/components/organisms/AvailableWorks";
import { ArtsyWorksLoader } from "@/src/components/organisms/ArtsyWorksLoader";
import { InstagramStrip } from "@/src/components/organisms/InstagramStrip";
import { ContactForm } from "@/src/components/organisms/ContactForm";
import { Footer } from "@/src/components/organisms/Footer";

export default function Home() {
  return (
    <PageTransition>
      <SmoothScrollWrapper>
        <ScrollProgressBar />
        <Header />
        <main>
          <AdaptiveGallery />
          <Bio />
          <Suspense fallback={<AvailableWorks />}>
            <ArtsyWorksLoader />
          </Suspense>
          <Suspense fallback={null}>
            <InstagramStrip />
          </Suspense>
          <ContactForm />
        </main>
        <Footer />
      </SmoothScrollWrapper>
    </PageTransition>
  );
}
