import Carousel from "../../../components/swiper/swiper";
import HeaderSection from "../../../components/hero";
import { CardBrand } from "../../../components/card/brandCard";
import { ProductTabs } from "../../../components/productTabs";
import { RatingCard } from "../../../components/card/ratingCard";
import { SuggestCard } from "../../../components/card/suggestCard";
import { ButtonCategory} from "../../../components/button/btnCategory";

export default async function Home() {
  return (
    <div className="w-full relative left-0 space-x-0">
      <HeaderSection />
      <section className="w-full pb-20">
        <div className="container mx-auto flex flex-col gap-40 px-10 py-25 relative">
          <Carousel />
          <ButtonCategory/>
          <ProductTabs />
          <SuggestCard />
          {/* <RatingCard /> */}
          <CardBrand />
        </div>
      </section>
    </div>
  );
}
