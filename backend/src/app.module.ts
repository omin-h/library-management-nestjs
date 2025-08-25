import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorsModule } from './modules/authors/authors.module';
import { BooksModule } from './modules/books/books.module';
import { MembersModule } from './modules/members/members.module';

import { Author } from './modules/authors/authors.entity';
import { Member } from './modules/members/members.entity';
import { Book } from './modules/books/books.entity';


@Module({
  imports: [MembersModule, BooksModule, AuthorsModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'src/config/library.db',
    entities: [Author, Member, Book],
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
