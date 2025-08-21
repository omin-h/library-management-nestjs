import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, Logger, Query, NotFoundException } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './members.entity';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateMemberDto } from './dto/create-member.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('members')
export class MembersController {
  private readonly logger = new Logger(MembersController.name);

  constructor(private readonly membersService: MembersService) {}

  @Post()

  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'Member created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })

  @HttpCode(HttpStatus.CREATED)
  async create(@Body() member: CreateMemberDto): Promise<Member> {
    if (!member.id || !member.name || !member.email || !member.joinedDate) {
      this.logger.warn('Create failed: Invalid data sent');
      throw new BadRequestException('ID, name, email, and joinedDate are required');
    }
    const existing = await this.membersService.findOne(member.id);
    if (existing) {
      this.logger.warn(`Create failed: Duplicate id ${member.id}`);
      throw new BadRequestException('Duplicate member id');
    }
    const created = await this.membersService.create(member);
    this.logger.log(`Member created: ${created.id}`);
    return created;
  }

  // Get all members with pagination

  @Get()
  @ApiOperation({ summary: 'Get all members with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of members.' })

  async findAll(
      @Query() pagination: PaginationQueryDto,
    ): Promise<{ data: Member[]; total: number; page: number; limit: number }> {
      const result = await this.membersService.findAll(pagination);
      this.logger.log(
        `Fetched ${result.data.length} member(s) (page ${result.page}, limit ${result.limit}, total ${result.total})`,
      );
      return result;
  }



  @Get(':id')

  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiResponse({ status: 200, description: 'Member found.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })

  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Member> {
    const member = await this.membersService.findOne(id);
    if (!member) {
      this.logger.warn(`Fetch failed: Member ${id} not found`);
      throw new NotFoundException('Member not found');
    }
    this.logger.log(`Fetched member: ${id}`);
    return member;
  }

  @Put(':id')

  @ApiOperation({ summary: 'Update a member by ID' })
  @ApiResponse({ status: 200, description: 'Member updated successfully.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateMemberDto
  ): Promise<Member> {
    try {
      const updated = await this.membersService.update(id, updateData);
      this.logger.log(`Member updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.warn(`Update failed: Member ${id} not found`);
      throw error;
    }
  }

  @Delete(':id')

  @ApiOperation({ summary: 'Delete a member by ID' })
  @ApiResponse({ status: 204, description: 'Member deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })

  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.membersService.remove(id);
      this.logger.log(`Member deleted: ${id}`);
    } catch (error) {
      this.logger.warn(`Delete failed: Member ${id} not found`);
      throw error;
    }
  }
}