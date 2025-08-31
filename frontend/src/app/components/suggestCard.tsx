import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React from "react";
import { Headset } from "./logoSVG";

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
        ]

    return (
        <div>
            <Card className="inline-block px-3">
                {SuggestContent.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <CardHeader className="p-0 w-30">
                            {item.logo}
                        </CardHeader>
                        <div className="flex flex-col items-start gap-2">
                            <CardTitle>
                                <h1 className="text-[20px]">
                                    {item.title}
                                </h1>
                            </CardTitle>
                            <CardContent className="p-0 max-w-[24rem]">
                                <p className="text-[15px]">
                                    {item.content}
                                </p>
                            </CardContent>
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    )
}