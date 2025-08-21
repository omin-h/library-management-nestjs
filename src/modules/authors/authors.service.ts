import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './authors.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  create(author: Omit<Author, 'id'>): Promise<Author> {
    const newAuthor = this.authorsRepository.create(author);
    return this.authorsRepository.save(newAuthor);
  }

  async findAll(
      { page, limit }: PaginationQueryDto,
    ): Promise<{ data: Author[]; total: number; page: number; limit: number }> {
      const skip = (page - 1) * limit;

      const [data, total] = await this.authorsRepository.findAndCount({
        skip,
        take: limit,
        order: { id: 'ASC' },
      });
  
      return { data, total, page, limit };
  }
  

  async findOne(id: number): Promise<Author | null> {
    return await this.authorsRepository.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Author>): Promise<Author> {
    await this.authorsRepository.update(id, updateData);
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException('Author not found');
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.authorsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Author not found');
  }
}