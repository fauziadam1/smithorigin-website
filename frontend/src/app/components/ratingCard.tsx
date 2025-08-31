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
import { User } from "lucide-react";
import { HiMiniUser as UserIcon } from 'react-icons/hi2';

export function RatingCard() {
    return (
        <div>
            <h1 className="header-top-product text-center font-[700] text-2xl">Rating</h1>
            <div>
                <Card>
                    <CardHeader className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src="" alt="Profil"/>
                            <AvatarFallback><UserIcon/></AvatarFallback>
                        </Avatar>
                        <CardContent className="p-0">
                            <h1 className="font-[600] text-[14px]">Your Name</h1>
                            <p className="text-[11px] text-[#757575a7]"></p>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}