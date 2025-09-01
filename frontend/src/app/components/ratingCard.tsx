import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { HiMiniUser as UserIcon } from 'react-icons/hi2';
import { BsStarFill } from 'react-icons/bs';

export function RatingCard() {
    return (
        <div className="flex flex-col gap-10">
            <h1 className="header-top-product text-center font-[700] text-2xl">Rating</h1>
            <Carousel opts={{
                align: "start",
            }}
                className="w-full">
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) =>
                        <CarouselItem key={index} className="md:basis-1/4 ">
                            <div>
                                <Card className="w-72">
                                    <CardHeader className="flex items-center gap-4">
                                        <Avatar className="w-13 h-13">
                                            <AvatarImage src="" alt="Profil" />
                                            <AvatarFallback><UserIcon className="text-3xl" /></AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="flex flex-col gap-2 p-0">
                                            <h1 className="font-[600] text-[15px]">Your Name</h1>
                                            <p className="flex items-center gap-1 text-[14px] text-amber-300">
                                                <BsStarFill />
                                                <BsStarFill />
                                                <BsStarFill />
                                                <BsStarFill />
                                                <BsStarFill />
                                            </p>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-[13px] text-justify">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    )}
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext/>
            </Carousel>
        </div>
    )
}