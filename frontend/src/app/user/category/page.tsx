'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"
import ProductTabs from "../../../../components/card/featuredProduct"

export default function Category() {
    return (
        <div>
            <section className="container px-10 py-40 mx-auto h-fit flex items-start justify-center">
                <div className="w-full flex flex-col gap-10">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>KeyCaps</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex flex-col gap-5">
                        <h1 className="text-xl font-[600]">100 Product</h1>
                        <ProductTabs/>
                    </div>
                </div>
            </section>
        </div>
    )
}