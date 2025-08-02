import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, Logger } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { Author } from './authors.entity';

@Controller('authors')
export class AuthorsController {
  private readonly logger = new Logger(AuthorsController.name);

  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() author: Omit<Author, 'id'>): Promise<Author> {
    if (!author.name || !author.bio) {
      this.logger.warn('Create failed: Invalid data sent');
      throw new BadRequestException('name and bio are required');
    }
    const created = await this.authorsService.create(author);
    this.logger.log(`Author created: ${created.id}`);
    return created;
  }

  @Get()
  async findAll(): Promise<Author[]> {
    const authors = await this.authorsService.findAll();
    this.logger.log(`Fetched ${authors.length} author(s)`);
    return authors;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Author> {
    try {
      const author = await this.authorsService.findOne(id);
      this.logger.log(`Fetched author: ${id}`);
      return author;
    } catch (error) {
      this.logger.warn(`Fetch failed: Author ${id} not found`);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Author>
  ): Promise<Author> {
    try {
      const updated = await this.authorsService.update(id, updateData);
      this.logger.log(`Author updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.warn(`Update failed: Author ${id} not found`);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.authorsService.remove(id);
      this.logger.log(`Author deleted: ${id}`);
    } catch (error) {
      this.logger.warn(`Delete failed: Author ${id} not found`);
      throw error;
    }
  }
}