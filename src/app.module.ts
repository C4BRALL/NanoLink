import { Module } from '@nestjs/common';
import { DomainModule } from './core/domain/domain.module';
import { UseCasesModule } from './core/use-cases/use-cases.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { InterfaceModule } from './interface/interface.module';

@Module({
  imports: [DomainModule, UseCasesModule, DatabaseModule, AuthModule, InterfaceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
