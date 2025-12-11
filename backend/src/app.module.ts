import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BeneficiosModule } from './beneficios/beneficios.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        BeneficiosModule,
    ],
})
export class AppModule { }
