import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prismaService: PrismaService) {}

  createBookmark(dealId: number, user: User) {
    return this.prismaService.deal.update({
      where: { id: dealId },
      data: {
        bookmarksCount: { increment: 1 },
        bookmarks: { create: { userId: user.id } },
      },
    });
  }

  deleteBookmark(dealId: number, user: User) {
    return this.prismaService.deal.update({
      where: { id: dealId },
      data: {
        bookmarksCount: { decrement: 1 },
        bookmarks: { delete: { userId_dealId: { userId: user.id, dealId } } },
      },
    });
  }
}
