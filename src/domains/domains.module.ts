import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { DealsModule } from './deals/deals.module';

@Module({
  imports: [AccountsModule, AuthModule, DealsModule],
})
export class DomainsModule {}
