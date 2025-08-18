import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './books.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(book: Omit<Book, 'id'>): Promise<Book> {
    const existing = await this.booksRepository.findOneBy({ isbn: book.isbn });
    if (existing) {
      throw new BadRequestException('ISBN must be unique');
    }
    const newBook = this.booksRepository.create(book);
    return this.booksRepository.save(newBook);
  }

  async findAll(
    { page, limit }: PaginationQueryDto,
  ): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.booksRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    return { data, total, page, limit };
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