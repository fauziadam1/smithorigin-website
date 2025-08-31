import { Tabs, Tab } from "@heroui/react";
import { CardProduct } from "./card";
import React from "react";

export function ProductTabs() {

    const tabs: {
        id: string;
        label: string;
        content: React.ReactNode;
    }[] = [
            {
                id: "product",
                label: "Product",
                content: <CardProduct />,
            },
        ];

    return (
        <div className="container mx-auto px-10 flex flex-col">
            <h1 className="font-[700] text-2xl mb-2">Featured Product</h1>
            <Tabs aria-label="Dynamic tabs" items={tabs} variant="underlined" className="-translate-x-3.5 mb-4 font-[500]">
                {tabs.map((item) => (
                    <Tab key={item.id} title={item.label}>{item.content}</Tab>
                ))}
            </Tabs>
        </div>
    )
}