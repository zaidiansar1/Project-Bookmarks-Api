import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { BookmarkDTO } from "./dto";
import { BookmarkService } from "./bookmark.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('bookmark')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}
    //Create a bookmark
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    createBookmark(@Body() dto: BookmarkDTO, @Req() req) {
        dto.userId = req.user.id;
        return this.bookmarkService.createBookmark(dto);
    }

    //Delete a bookmark
    //Update a bookmark
    //Read the bookmarks
}