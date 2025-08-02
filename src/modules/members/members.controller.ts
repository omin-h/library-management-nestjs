import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, BadRequestException, Logger } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './members.entity';

@Controller('members')
export class MembersController {
  private readonly logger = new Logger(MembersController.name);

  constructor(private readonly membersService: MembersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() member: Omit<Member, 'id'>): Promise<Member> {
    if (!member.name || !member.email || !member.joinedDate) {
      this.logger.warn('Create failed: Invalid data sent');
      throw new BadRequestException('Name, email, and joinedDate are required');
    }
    const created = await this.membersService.create(member);
    this.logger.log(`Member created: ${created.id}`);
    return created;
  }

  @Get()
  async findAll(): Promise<Member[]> {
    const members = await this.membersService.findAll();
    this.logger.log(`Fetched ${members.length} member(s)`);
    return members;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Member> {
    try {
      const member = await this.membersService.findOne(id);
      this.logger.log(`Fetched member: ${id}`);
      return member;
    } catch (error) {
      this.logger.warn(`Fetch failed: Member ${id} not found`);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Member>
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