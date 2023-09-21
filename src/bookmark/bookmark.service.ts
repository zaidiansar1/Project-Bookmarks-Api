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

    async deleteBookmark(id: number, userId: number) {
        try {
            const bookmark = await this.prisma.bookmark.findMany({
                where: {
                    id,
                    AND: {
                        userId: userId,
                    }
                }
            });

            if (bookmark.length === 0) return false;

            await this.prisma.bookmark.deleteMany({
                where: {
                    id,
                    AND: {
                        userId: userId,
                    }
                }
            });
    
            return true;
        } catch (error) {
            throw error;
        }
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

    async updateBookmark(bookmarkId: number, dto: BookmarkDTO) {
        try {
            const bookmark = await this.prisma.bookmark.findMany({
                where: {
                    id: bookmarkId,
                    AND: {
                        userId: dto.userId,
                    }
                }
            });

            if (bookmark.length === 0) return false;
            
            await this.prisma.bookmark.updateMany({
                where: {
                    id: bookmarkId,
                    AND: {
                        userId: dto.userId,
                    }
                },
                data: {
                    title: dto.title,
                    link: dto.link,
                }
            });
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}