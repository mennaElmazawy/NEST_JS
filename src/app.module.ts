import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { BrandModule } from './modules/brand/brand.module.js';
import { CategoryModule } from './modules/category/category.module.js';
import { ProductModule } from './modules/product/product.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected to db successfully ✅👌👌'));
        return connection;
      },
    }),
    UserModule,
    BrandModule,
    CategoryModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
