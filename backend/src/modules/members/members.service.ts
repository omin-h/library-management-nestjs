import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './members.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  create(member: Omit<Member, 'id'>): Promise<Member> {
    const newMember = this.membersRepository.create(member);
    return this.membersRepository.save(newMember);
  }

  async findAll(
      { page, limit }: PaginationQueryDto,
    ): Promise<{ data: Member[]; total: number; page: number; limit: number }> {
      const skip = (page - 1) * limit;

      const [data, total] = await this.membersRepository.findAndCount({
        skip,
        take: limit,
        order: { id: 'ASC' },
      });
  
      return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Member | null> {
    return await this.membersRepository.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Member>): Promise<Member> {
    await this.membersRepository.update(id, updateData);
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException('Member not found');
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.membersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Member not found');
  }
}