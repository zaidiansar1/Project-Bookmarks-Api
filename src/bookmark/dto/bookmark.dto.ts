import { IsNotEmpty, IsNumber, IsUrl } from "class-validator";

export class BookmarkDTO {
    @IsNotEmpty()
    title: string;

    @IsUrl()
    @IsNotEmpty()
    link: string;

    userId: number;
}