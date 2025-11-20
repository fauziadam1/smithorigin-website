import Carousel from "../components/ui/swiper";
import HeaderSection from "../components/ui/hero_section";
import { ButtonCategory } from "../components/ui/btn_category";
import FeaturedProduct from "../components/ui/featured_product";
import SuggestCard from "../components/ui/suggest_card";
import { BrandCard } from "../components/ui/brand_card";

export default async function DashboardUser() {
  return (
    <div className="w-full relative left-0 space-x-0">
      <HeaderSection />
      <section className="w-full pb-20">
        <div className="container mx-auto flex flex-col gap-40 px-10 py-25 relative">
          <Carousel />
          <ButtonCategory/>
          <FeaturedProduct />
          <SuggestCard/>
          <BrandCard />
        </div>
      </section>
    </div>
  );
}
