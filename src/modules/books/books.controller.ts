import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, Logger, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './books.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() book: Omit<Book, 'id'>): Promise<Book> {
    if (!book.title || !book.author || !book.isbn || !book.publishedYear) {
      this.logger.warn('Create failed: Invalid data sent');
      throw new BadRequestException('title, author, isbn, and publishedYear are required');
    }
    const created = await this.booksService.create(book);
    this.logger.log(`Book created: ${created.id}`);
    return created;
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const result = await this.booksService.findAll(pagination);
    this.logger.log(
      `Fetched ${result.data.length} book(s) (page ${result.page}, limit ${result.limit}, total ${result.total})`,
    );
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    try {
      const book = await this.booksService.findOne(id);
      this.logger.log(`Fetched book: ${id}`);
      return book;
    } catch (error) {
      this.logger.warn(`Fetch failed: Book ${id} not found`);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Book>
  ): Promise<Book> {
    try {
      const updated = await this.booksService.update(id, updateData);
      this.logger.log(`Book updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.warn(`Update failed: Book ${id} not found`);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.booksService.remove(id);
      this.logger.log(`Book deleted: ${id}`);
    } catch (error) {
      this.logger.warn(`Delete failed: Book ${id} not found`);
      throw error;
    }
  }
}