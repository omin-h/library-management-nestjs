import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './books.entity';

describe('BooksController', () => {
    let controller: BooksController;
    let service: BooksService;

    const mockBook: Book = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        publishedYear: 2023,
    };

    const mockBooksService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [
                {
                    provide: BooksService,
                    useValue: mockBooksService,
                },
            ],
        }).compile();

        controller = module.get<BooksController>(BooksController);
        service = module.get<BooksService>(BooksService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a book successfully', async () => {
            const createBookDto = { title: 'Test Book', author: 'Test Author', isbn: '1234567890', publishedYear: 2023 };
            mockBooksService.create.mockResolvedValue(mockBook);

            const result = await controller.create(createBookDto);

            expect(service.create).toHaveBeenCalledWith(createBookDto);
            expect(result).toEqual(mockBook);
        });

        it('should throw BadRequestException when title is missing', async () => {
            const createBookDto = { author: 'Test Author', isbn: '1234567890', publishedYear: 2023 };

            await expect(controller.create(createBookDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException when author is missing', async () => {
            const createBookDto = { title: 'Test Book', isbn: '1234567890', publishedYear: 2023 };

            await expect(controller.create(createBookDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException when isbn is missing', async () => {
            const createBookDto = { title: 'Test Book', author: 'Test Author', publishedYear: 2023 };

            await expect(controller.create(createBookDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException when publishedYear is missing', async () => {
            const createBookDto = { title: 'Test Book', author: 'Test Author', isbn: '1234567890' };

            await expect(controller.create(createBookDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return an array of books', async () => {
            const mockBooks = [mockBook];
            mockBooksService.findAll.mockResolvedValue(mockBooks);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockBooks);
        });

        it('should return empty array when no books exist', async () => {
            mockBooksService.findAll.mockResolvedValue([]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a book by id', async () => {
            mockBooksService.findOne.mockResolvedValue(mockBook);

            const result = await controller.findOne(1);

            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockBook);
        });

        it('should throw NotFoundException when book not found', async () => {
            mockBooksService.findOne.mockRejectedValue(new NotFoundException('Book not found'));

            await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith(999);
        });
    });

    describe('update', () => {
        it('should update a book successfully', async () => {
            const updateData = { title: 'Updated Title' };
            const updatedBook = { ...mockBook, ...updateData };
            mockBooksService.update.mockResolvedValue(updatedBook);

            const result = await controller.update(1, updateData);

            expect(service.update).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedBook);
        });

        it('should throw NotFoundException when updating non-existent book', async () => {
            const updateData = { title: 'Updated Title' };
            mockBooksService.update.mockRejectedValue(new NotFoundException('Book not found'));

            await expect(controller.update(999, updateData)).rejects.toThrow(NotFoundException);
            expect(service.update).toHaveBeenCalledWith(999, updateData);
        });
    });

    describe('remove', () => {
        it('should remove a book successfully', async () => {
            mockBooksService.remove.mockResolvedValue(undefined);

            await controller.remove(1);

            expect(service.remove).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when removing non-existent book', async () => {
            mockBooksService.remove.mockRejectedValue(new NotFoundException('Book not found'));

            await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
            expect(service.remove).toHaveBeenCalledWith(999);
        });
    });
});