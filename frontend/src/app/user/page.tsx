import Carousel from "../components/ui/Swiper";
import HeaderSection from "../components/ui/Hero";
import { ButtonCategory } from "../components/ui/CategoryButton";
import FeaturedProduct from "../components/ui/Featured";
import SuggestCard from "../components/ui/Suggest";
import { BrandCard } from "../components/ui/Brand";

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
