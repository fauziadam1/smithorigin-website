import Carousel from "../../../components/swiper/swiper";
import HeaderSection from "../../../components/hero";
import { CardBrand } from "../../../components/card/brandCard";
import FeaturedProduct from "../../../components/card/featuredProduct";
import { SuggestCard } from "../../../components/card/suggestCard";
import { ButtonCategory} from "../../../components/button/btnCategory";

export default async function DashboardUser() {
  return (
    <div className="w-full relative left-0 space-x-0">
      <HeaderSection />
      <section className="w-full pb-20">
        <div className="container mx-auto flex flex-col gap-40 px-10 py-25 relative">
          <Carousel />
          <ButtonCategory/>
          <FeaturedProduct />
          <SuggestCard />
          <CardBrand />
        </div>
      </section>
    </div>
  );
}
