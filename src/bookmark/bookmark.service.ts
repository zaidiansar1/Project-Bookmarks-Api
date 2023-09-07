import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { BookmarkDTO } from "./dto";
import { RepositoryService } from "src/repository/repository.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Bookmark } from "@prisma/client";

@Injectable()
export class BookmarkService {
    constructor(private prisma: RepositoryService) {}

    async createBookmark(dto: BookmarkDTO): Promise<Bookmark> {
        try {
            const bookmark = await this.prisma.bookmark.create({
                data: {
                    title: dto.title,
                    link: dto.link,
                    userId: dto.userId,
                }
            });
    
            return bookmark;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new BadGatewayException('Already bookmarked');
            }
        }
    }

    async deleteBookmark(id: number): Promise<string> {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id,
            }
        });

        if (!bookmark) {
            throw new NotFoundException('Bookmark not found');
        }

        await this.prisma.bookmark.delete({
            where: {
                id,
            }
        });

        return `Successfully deleted the bookmark ${id}`;
    }

    async getBookmarks(userId: number) {
        try {
            const bookmarks = await this.prisma.bookmark.findMany({
                where: {
                    userId
                }
            })
    
            return bookmarks;
        } catch (error) {
            throw new NotFoundException("No Bookmarks found");
        }
    }
}