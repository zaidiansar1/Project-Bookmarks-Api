import { Injectable } from "@nestjs/common";
import { BookmarkDTO } from "./dto";
import { RepositoryService } from "src/repository/repository.service";

@Injectable()
export class BookmarkService {
    constructor(private prisma: RepositoryService) {}

    async createBookmark(dto: BookmarkDTO) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                title: dto.title,
                link: dto.link,
                userId: dto.userId,
            }
        });

        return bookmark;
    }
}