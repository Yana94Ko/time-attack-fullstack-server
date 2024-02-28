import { Module } from '@nestjs/common';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';

@Module({
  controllers: [DealsController],
  providers: [DealsService],
  imports: [BookmarksModule],
})
export class DealsModule {}
