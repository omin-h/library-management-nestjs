import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './authors.entity';

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

  findAll(): Promise<Author[]> {
    return this.authorsRepository.find();
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorsRepository.findOneBy({ id });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(id: number, updateData: Partial<Author>): Promise<Author> {
    await this.authorsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.authorsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Author not found');
  }
}