import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { Request } from 'express';
import { DAccountType } from 'src/decorators/accountType.decorator';
import { Private } from 'src/decorators/private.decorator';
import { BookmarksService } from './bookmarks/bookmarks.service';
import { DealCreateDto, DealUpdateDto } from './deals.dto';
import { DealsService } from './deals.service';
import { DealOrderType } from './deals.type';

@Controller('deals')
export class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly bookmarksService: BookmarksService,
  ) {}

  @Post()
  @Private('user')
  @UseInterceptors(FileInterceptor('productImg'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: DealCreateDto,
    @DAccountType('user') user: User,
  ) {
    return this.dealsService.create(dto, file, user);
  }

  @Get()
  findAll(
    @Query('type') type: DealOrderType = 'createdAt',
    @Query('cnt', ParseIntPipe) cnt: number = 6,
  ) {
    return this.dealsService.findAll(type, cnt);
  }

  @Get(':dealId')
  findOne(@Param('dealId', ParseIntPipe) dealId: number, @Req() req: Request) {
    return this.dealsService.findOne(dealId, req.user);
  }

  @Patch(':dealId')
  @Private('user')
  @UseInterceptors(FileInterceptor('productImg'))
  update(
    @Param('dealId', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: DealUpdateDto,
    @DAccountType('user') user: User,
  ) {
    return this.dealsService.update(id, dto, file, user);
  }

  @Post(':dealId/bookmarks')
  @Private('user')
  createBookmark(
    @Param('dealId', ParseIntPipe) dealId: number,
    @DAccountType('user') user: User,
  ) {
    return this.bookmarksService.createBookmark(dealId, user);
  }

  @Delete(':dealId/bookmarks')
  @Private('user')
  deleteBookmark(
    @Param('dealId', ParseIntPipe) dealId: number,
    @DAccountType('user') user: User,
  ) {
    return this.bookmarksService.deleteBookmark(dealId, user);
  }

  @Delete(':dealId')
  @Private('user')
  remove(
    @Param('dealId', ParseIntPipe) dealId: number,
    @DAccountType('user') user: User,
  ) {
    return this.dealsService.remove(dealId, user);
  }
}
