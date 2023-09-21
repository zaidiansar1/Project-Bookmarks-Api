import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { BookmarkDTO } from "./dto";
import { BookmarkService } from "./bookmark.service";
import { AuthGuards } from "src/auth/guards";

@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}
    
    @UseGuards(AuthGuards)
    @Post('create')
    createBookmark(@Body() dto: BookmarkDTO, @Req() req) {
        dto.userId = req.user.id;
        return this.bookmarkService.createBookmark(dto);
    }

    @UseGuards(AuthGuards)
    @Delete('delete/:id')
    deleteBookmark(@Param('id') id: string, @Req() req) {
        return this.bookmarkService.deleteBookmark(parseInt(id), req.user.id);
    }

    @UseGuards(AuthGuards)
    @Get('/getAll')
    getBookmarks(@Req() req) {
        return this.bookmarkService.getBookmarks(req.user.id);
    }

    @UseGuards(AuthGuards)
    @Post('update/:id')
    updateBookmark(
        @Param('id') id: string, 
        @Body() dto: BookmarkDTO, 
        @Req() req
    ) {
        dto.userId = req.user.id;
        return this.bookmarkService.updateBookmark(parseInt(id), dto);
    }
}