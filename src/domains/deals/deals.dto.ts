import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class DealCreateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsNumberString()
  price: number;
}

export class DealUpdateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsNumber()
  price: number;
}
