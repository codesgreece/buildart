"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { SelectionProvider } from "@/context/SelectionContext";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { Navigation } from "@/components/navigation/Navigation";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { Hero } from "@/components/hero/Hero";
import { ConstructionStory } from "@/components/construction-story/ConstructionStory";
import { Products } from "@/components/products/Products";
import { Fireplace } from "@/components/fireplace/Fireplace";
import { EnergyUpgrade } from "@/components/energy-upgrade/EnergyUpgrade";
import { PortfolioDoor } from "@/components/portfolio-door/PortfolioDoor";
import { ClimateControl } from "@/components/climate-control/ClimateControl";
import { DayNight } from "@/components/day-night/DayNight";
import { CompanyStory } from "@/components/company-story/CompanyStory";
import { HouseConfigurator } from "@/components/house-configurator/HouseConfigurator";
import { Quote } from "@/components/quote/Quote";
import { Footer } from "@/components/footer/Footer";

const ConstructionLoader = dynamic(
  () =>
    import("@/components/loader/ConstructionLoader").then(
      (m) => m.ConstructionLoader,
    ),
  { ssr: false },
);

export function Experience() {
  const [loaded, setLoaded] = useState(false);

  const onLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <SelectionProvider>
      {!loaded && <ConstructionLoader onComplete={onLoaderComplete} />}
      <SmoothScroll>
        {loaded && <ScrollProgress />}
        <Navigation visible={loaded} />
        <main
          className={loaded ? "opacity-100" : "opacity-0"}
          style={{ transition: "opacity 0.8s ease" }}
        >
          <Hero />
          <ConstructionStory />
          <Products />
          <Fireplace />
          <EnergyUpgrade />
          <PortfolioDoor />
          <ClimateControl />
          <DayNight />
          <CompanyStory />
          <HouseConfigurator />
          <Quote />
        </main>
        {loaded && <Footer />}
      </SmoothScroll>
    </SelectionProvider>
  );
}
