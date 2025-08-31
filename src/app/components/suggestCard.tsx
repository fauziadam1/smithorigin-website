import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const Headset = () => {
    return (
        <svg width="84" height="88" viewBox="0 0 84 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <path d="M83.6666 62.8413C83.6647 68.5395 81.717 74.0662 78.1459 78.5064C74.5747 82.9467 69.5943 86.0343 64.0291 87.258L61.3708 79.283C63.8051 78.8821 66.1201 77.9461 68.1491 76.5425C70.178 75.139 71.8704 73.3028 73.1041 71.1663H62.8332C60.6231 71.1663 58.5035 70.2884 56.9407 68.7256C55.3779 67.1628 54.4999 65.0431 54.4999 62.833V46.1663C54.4999 43.9562 55.3779 41.8366 56.9407 40.2738C58.5035 38.711 60.6231 37.833 62.8332 37.833H75.0749C74.0581 29.7784 70.1371 22.3716 64.0475 17.0025C57.958 11.6333 50.1184 8.67083 41.9999 8.67083C33.8814 8.67083 26.0419 11.6333 19.9523 17.0025C13.8628 22.3716 9.94171 29.7784 8.92492 37.833H21.1666C23.3767 37.833 25.4963 38.711 27.0591 40.2738C28.6219 41.8366 29.4999 43.9562 29.4999 46.1663V62.833C29.4999 65.0431 28.6219 67.1628 27.0591 68.7256C25.4963 70.2884 23.3767 71.1663 21.1666 71.1663H8.66658C6.45645 71.1663 4.33683 70.2884 2.77403 68.7256C1.21123 67.1628 0.333252 65.0431 0.333252 62.833V41.9997C0.333252 18.9872 18.9874 0.333008 41.9999 0.333008C65.0124 0.333008 83.6666 18.9872 83.6666 41.9997V62.8413ZM75.3333 62.833V46.1663H62.8332V62.833H75.3333ZM8.66658 46.1663V62.833H21.1666V46.1663H8.66658Z" fill="#930819" />
        </svg>
    );
};

export function RatingCard() {

    const contents: {
        logo: string;
        title: string;

    }[] = [
        {
            
        }
    ]

    return (
        <div>
            <Card className="inline-block">
                <div className="flex items-center gap-2">
                    <CardHeader className="p-0 w-30">
                        <Headset />
                    </CardHeader>
                    <div>
                        <CardTitle className="items-center inline-block">
                            <h1>Free consultation</h1>
                        </CardTitle>
                        <CardContent className="flex items-center p-0 max-w-[25rem]">
                            <p>Not sure which gear fits your style? Our team is ready to guide you and help you choose the perfect equipment.</p>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    )
}