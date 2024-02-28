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
import { DealCreateDto, DealUpdateDto } from './deals.dto';
import { DealsService } from './deals.service';
import { DealOrderType } from './deals.type';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

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
  findAll(@Query('type') type: DealOrderType = 'createdAt') {
    return this.dealsService.findAll(type);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dealsService.remove(+id);
  }
}
