import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, Logger, Query, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { Author } from './authors.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorsController {
  private readonly logger = new Logger(AuthorsController.name);

  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)

  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: 201, description: 'Author created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input or duplicate author.' })

  async create(@Body() author: CreateAuthorDto): Promise<Author> {
    if (!author.id || !author.name || !author.bio) {
      this.logger.warn('Create failed: Invalid data sent');
      throw new BadRequestException('name and bio are required');
    }
    const existing = await this.authorsService.findOne(author.id);
    if (existing) {
      this.logger.warn(`Create failed: Duplicate id ${author.id}`);
      throw new BadRequestException('Duplicate author id');
    }
    const created = await this.authorsService.create(author);
    this.logger.log(`Author created: ${created.id}`);
    return created;
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of authors.' })

  async findAll(
      @Query() pagination: PaginationQueryDto,
    ): Promise<{ data: Author[]; total: number; page: number; limit: number }> {
      const result = await this.authorsService.findAll(pagination);
      this.logger.log(
        `Fetched ${result.data.length} author(s) (page ${result.page}, limit ${result.limit}, total ${result.total})`,
      );
      return result;
    }

  @Get(':id')

  @ApiOperation({ summary: 'Get a author by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'author found.' })
  @ApiResponse({ status: 404, description: 'author not found.' })


  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Author> {
    const author = await this.authorsService.findOne(id);
    if (!author) {
      this.logger.warn(`Fetch failed: Author ${id} not found`);
      throw new NotFoundException('Author not found');
    }
    this.logger.log(`Fetched author: ${id}`);
    return author;
  }

  @Put(':id')

  @ApiOperation({ summary: 'Update a author by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Author updated.' })
  @ApiResponse({ status: 404, description: 'Author not found.' })

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateAuthorDto
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

  @ApiOperation({ summary: 'Delete a author by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Author deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Author not found.' })

  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
    try {
      await this.authorsService.remove(id);
      this.logger.log(`Author deleted: ${id}`);
      return { message: `Author ${id} deleted successfully.` };
    } catch (error) {
      this.logger.warn(`Delete failed: Author ${id} not found`);
      throw error;
    }
  }
}