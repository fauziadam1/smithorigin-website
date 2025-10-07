'use client'
import { Tabs, Tab } from "@heroui/react";
import { CardProduct } from "./card/card";
import React from "react";

export function ProductTabs() {

    const tabs: {
        id: string;
        label: string;
        content: React.ReactNode;
    }[] = [
            {
                id: "best seller",
                label: "Best Seller",
                content: <CardProduct />,
            },
            {
                id: "new product",
                label: "New Product",
                content: <CardProduct />,
            },
            {
                id: "all",
                label: "All",
                content: <CardProduct />,
            },
        ];

    return (
        <div>
            <h1 className="font-[700] text-2xl mb-2">Featured Product</h1>
            <Tabs aria-label="Dynamic tabs" items={tabs} variant="underlined" className="-translate-x-3 mb-2 font-[500]">
                {tabs.map((item) => (
                    <Tab key={item.id} title={item.label}>{item.content}</Tab>
                ))}
            </Tabs>
        </div>
    )
}