import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import config from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { StudentModule } from './modules/student/student.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { SectionModule } from './modules/section/section.module';
import { YearModule } from './modules/year/year.module';
import { SubjectModule } from './modules/subject/subject.module';
import { DegreeModule } from './modules/degree/degree.module';
import { SubSectionModule } from './modules/subsection/subsection.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/shared/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secretKey')
      }),
      global: true,
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString')
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    EmployeeModule,
    YearModule,
    SectionModule,
    SubSectionModule,
    SubjectModule,
    DoctorModule,
    StudentModule,
    DegreeModule
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: RolesGuard }
  ],
})
export class AppModule {}
