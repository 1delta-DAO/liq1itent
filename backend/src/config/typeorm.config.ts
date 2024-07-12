import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmNamingStrategy } from '../shared/util/typeorm-naming-strategy';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const options = {
      type: this.configService.get('TYPEORM_CONNECTION'),
      host: this.configService.get('TYPEORM_HOST', 'localhost'),
      port: JSON.parse(this.configService.get('TYPEORM_PORT', '5432')),
      username: this.configService.get('TYPEORM_USERNAME'),
      password: this.configService.get('TYPEORM_PASSWORD'),
      database: this.configService.get('TYPEORM_DATABASE'),
      autoLoadEntities: true,
      synchronize: JSON.parse(this.configService.get('TYPEORM_SYNCHRONIZE')),
      logging: JSON.parse(this.configService.get('TYPEORM_LOGGING')),
      namingStrategy: new TypeOrmNamingStrategy(),
    } as TypeOrmModuleOptions;
    return options;
  }
}
