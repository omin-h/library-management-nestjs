import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './members.entity';

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

  findAll(): Promise<Member[]> {
    return this.membersRepository.find();
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.membersRepository.findOneBy({ id });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async update(id: number, updateData: Partial<Member>): Promise<Member> {
    await this.membersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.membersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Member not found');
  }
}