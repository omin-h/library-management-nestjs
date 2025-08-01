import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './books.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  create(book: Omit<Book, 'id'>): Promise<Book> {
    const newBook = this.booksRepository.create(book);
    return this.booksRepository.save(newBook);
  }

  findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: number, updateData: Partial<Book>): Promise<Book> {
    await this.booksRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.booksRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Book not found');
  }
}