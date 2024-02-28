import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

@Module({
  controllers: [],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
