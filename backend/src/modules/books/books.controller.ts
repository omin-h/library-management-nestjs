import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, Logger, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Book } from './books.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';


@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)

  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input or duplicate ISBN.' })

  async create(@Body() book: CreateBookDto): Promise<Book> {
    if (!book.title || !book.author || !book.isbn || !book.publishedYear) {
      this.logger.warn('Create failed: Invalid data sent');
      throw new BadRequestException('title, author, isbn, and publishedYear are required');
    }
    const created = await this.booksService.create(book);
    this.logger.log(`Book created: ${created.id}`);
    return created;
  }

  @Get()

  @ApiOperation({ summary: 'Get all books with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of books.' })

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

  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Book found.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })

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

  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Book updated.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateBookDto
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

  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Book deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise< {message: string} > {
    try {
      await this.booksService.remove(id);
      this.logger.log(`Book deleted: ${id}`);
      return { message: `Book ${id} deleted successfully.` };
    } catch (error) {
      this.logger.warn(`Delete failed: Book ${id} not found`);
      throw error;
    }
  }
}