import { Module } from '@nestjs/common';
import { DomainModule } from './core/domain/domain.module';
import { UseCasesModule } from './core/use-cases/use-cases.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { InterfaceModule } from './interface/interface.module';
import { DocumentationModule } from './infrastructure/documentation/documentation.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { LoggerModule } from './infrastructure/logger/logger.module';

@Module({
  imports: [
    DomainModule,
    UseCasesModule,
    DatabaseModule,
    AuthModule,
    InterfaceModule,
    DocumentationModule,
    InfrastructureModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
