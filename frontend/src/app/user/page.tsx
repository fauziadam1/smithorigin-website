import Carousel from "../components/ui/swiper";
import HeaderSection from "../components/ui/hero";
import { ButtonCategory } from "../components/ui/categorybutton";
import FeaturedProduct from "../components/ui/featured";
import { BrandCard } from "../components/ui/brand";

export default async function DashboardUser() {
  return (
    <div className="w-full relative left-0 space-x-0">
      <HeaderSection />
      <section className="w-full pb-20">
        <div className="container mx-auto flex flex-col gap-40 px-10 py-25 relative">
          <BrandCard />
          <Carousel />
          <ButtonCategory/>
          <FeaturedProduct />
        </div>
      </section>
    </div>
  );
}
