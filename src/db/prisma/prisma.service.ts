import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { generateRandomImgSrc } from 'src/utils/generateRandomImgSrc';
import { getRandomNickname } from 'src/utils/generateRandomNickname';

export const prismaExtendedClient = (prismaClient: PrismaClient) =>
  prismaClient.$extends({
    query: {
      user: {
        create({ args, query }) {
          args.data = {
            ...args.data,
            profile: {
              create: {
                nickname: getRandomNickname(),
              },
            },
          };

          return query(args);
        },
      },
      deal: {
        create({ args, query }) {
          args.data = {
            ...args.data,
            imgUrl: args.data.imgUrl
              ? args.data.imgUrl
              : generateRandomImgSrc(),
          };

          return query(args);
        },
      },
    },
  });
prismaExtendedClient.bind(this);
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  readonly extendedClient = prismaExtendedClient(this);

  constructor() {
    super();
    return new Proxy(this, {
      get: (target, property) =>
        Reflect.get(
          property in this.extendedClient ? this.extendedClient : target,
          property,
        ),
    });
  }
  async onModuleInit() {
    //this.setMiddlewares();
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
