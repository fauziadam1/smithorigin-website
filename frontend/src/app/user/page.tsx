import Carousel from "../components/swiper/swiper";
import HeaderSection from "../components/card/hero_section";
import { ButtonCategory } from "../components/button/btn_category";
import FeaturedProduct from "../components/card/featured_product";
import SuggestCard from "../components/card/suggest_card";
import { BrandCard } from "../components/card/brand_card";

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
