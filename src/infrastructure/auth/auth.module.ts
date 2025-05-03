import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt/jwt.service';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { ConfigurationModule } from '../config/config.module';

@Module({
  imports: [
    ConfigurationModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [EnvironmentConfigService],
      useFactory: (cfg: EnvironmentConfigService) => ({
        secret: cfg.get('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [{ provide: 'JwtInterface', useClass: JwtService }],
  exports: ['JwtInterface'],
})
export class AuthModule {}
