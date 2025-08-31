import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import React from "react";
import {
    Headset,
    Diamond,
    Box,
    Truck,
    GamePad
} from "./logoSVG";

export function SuggestCard() {

    const SuggestContent: {
        title: string;
        content: string;
        logo: React.ReactNode;
    }[] = [
            {
                logo: <Headset />,
                title: "Free Consultation",
                content: "Not sure which gear fits your style? Our team is ready to guide you and help you choose the perfect equipment."
            },
            {
                logo: <Diamond />,
                title: "Premium Products",
                content: "We only provide high-quality gaming gear that has been tested and trusted to deliver the best performance for every gamer."
            },
            {
                logo: <Box />,
                title: "Safe Packing",
                content: "Every package is carefully packed with extra protection to ensure your gear arrives in perfect condition."
            },
            {
                logo: <Truck />,
                title: "Fast Delivery",
                content: "Your order will be shipped quickly and reliably, so you can enjoy your gaming setup without unnecessary delays."
            },
            {
                logo: <GamePad />,
                title: "Trusted by Gamers",
                content: "Thousands of gamers rely on us for their keyboards, mice, and accessories, making us a trusted choice in the gaming community."
            },
        ]

    return (
        <div className="flex flex-col gap-10 relative">
            <h1 className="header-top-product text-center font-[700] text-2xl">Why Us?</h1>
            <div className="flex flex-col items-center gap-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {SuggestContent.slice(0, 3).map((item, index) => (
                        <Card key={index} className="flex items-center justify-center px-6 h-40">
                            <div className="flex items-center gap-5">
                                <CardContent className="p-0 flex items-center justify-center">
                                    {item.logo}
                                </CardContent>
                                <div className="flex flex-col items-start gap-2">
                                    <CardTitle>
                                        <h1 className="text-[20px]">{item.title}</h1>
                                    </CardTitle>
                                    <CardDescription className="p-0 max-w-[18rem]">
                                        <p className="text-[13px]">{item.content}</p>
                                    </CardDescription>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl justify-items-center">
                    {SuggestContent.slice(3, 5).map((item, index) => (
                        <Card key={index} className="flex items-center justify-center px-6 h-40 w-full">
                            <div className="flex items-center gap-5">
                                <CardContent className="p-0 flex items-center justify-center">
                                    {item.logo}
                                </CardContent>
                                <div className="flex flex-col items-start gap-2">
                                    <CardTitle>
                                        <h1 className="text-[20px]">{item.title}</h1>
                                    </CardTitle>
                                    <CardDescription className="p-0 max-w-[18rem]">
                                        <p className="text-[13px]">{item.content}</p>
                                    </CardDescription>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}