import {
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { DealCreateDto, DealUpdateDto } from './deals.dto';

@Injectable()
export class DealsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async create(dto: DealCreateDto, file: Express.Multer.File, user: User) {
    //파일 업로드 진행
    const imgUrl = await this.uploadImgToS3(file);
    if (!file) throw new BadRequestException('File is not Exist');

    const deal = this.prismaService.deal.create({
      data: {
        ...dto,
        price: Number(dto.price),
        imgUrl,
        authorId: user.id,
      },
    });

    //성공시 받아온 url로 deal 생성
    return deal;
  }

  findAll() {
    return `This action returns all deals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deal`;
  }

  async update(
    id: number,
    dto: DealUpdateDto,
    file: Express.Multer.File,
    user: User,
  ) {
    let data: Prisma.DealUncheckedUpdateInput = {
      ...dto,
      price: Number(dto.price),
    };
    const imgUrl = await this.uploadImgToS3(file);
    if (imgUrl) data = { ...data, imgUrl };

    const deal = this.prismaService.deal.update({
      where: { id, authorId: user.id },
      data,
    });

    //성공시 받아온 url로 deal 생성
    return deal;
  }

  remove(id: number) {
    return `This action removes a #${id} deal`;
  }

  async uploadImgToS3(file: Express.Multer.File) {
    if (!file) return undefined;

    const awsRegion = this.configService.getOrThrow('AWS_REGION');
    const bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    const client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_KEY'),
      },
    });
    const key = `udemy/deals/${Date.now().toString()}-${file.originalname}`;
    const params: PutObjectCommandInput = {
      Key: key,
      Body: file.buffer,
      Bucket: bucketName,
      ACL: ObjectCannedACL.public_read,
    };
    const command = new PutObjectCommand(params);

    const uploadFileS3 = await client.send(command);

    if (uploadFileS3.$metadata.httpStatusCode !== 200)
      throw new BadRequestException('Failed upload File');
    const imgUrl = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
    return imgUrl;
  }
}
