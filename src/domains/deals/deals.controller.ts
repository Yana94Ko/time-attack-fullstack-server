import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { DAccountType } from 'src/decorators/accountType.decorator';
import { Private } from 'src/decorators/private.decorator';
import { DealCreateDto, DealUpdateDto } from './deals.dto';
import { DealsService } from './deals.service';

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
  findAll() {
    return this.dealsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(+id);
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
