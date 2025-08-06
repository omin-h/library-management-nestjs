import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { Author } from './authors.entity';

describe('AuthorController' , () => {
    let controller: AuthorsController;
    let service: AuthorsService;

    const mockAuthor: Author = {
        id: 2344,
        name: 'Donald Trump',
        bio: 'Donald is a good person',

    };

    const mockAuthorsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

     beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                controllers: [AuthorsController],
                providers: [
                    {
                        provide: AuthorsService,
                        useValue: mockAuthorsService,
                    },
                ],
            }).compile();

        controller = module.get<AuthorsController>(AuthorsController);
        service = module.get<AuthorsService>(AuthorsService);
    });

        afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a author successfully', async () => {
            const createAuthorDto = { name: 'Test Name', bio: 'Test  bio' };
            mockAuthorsService.create.mockResolvedValue(mockAuthor);

            const result = await controller.create(createAuthorDto);

            expect(service.create).toHaveBeenCalledWith(createAuthorDto);
            expect(result).toEqual(mockAuthor);

            });     

            it('should throw BadRequestException when name is missing', async () => {
            const createAuthorDto = { bio: 'Test Bio' };

            await expect(controller.create(createAuthorDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
            });

            it('should throw BadRequestException when bio is missing', async () => {
            const createAuthorDto = { name: 'Test name' };

            await expect(controller.create(createAuthorDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
            });

 describe('findAll', () => {
        it('should return an array of Authors', async () => {
            const mockAuthors = [mockAuthor];
            mockAuthorsService.findAll.mockResolvedValue(mockAuthors);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockAuthors);
        });

        it('should return empty array when no authors exist', async () => {
            mockAuthorsService.findAll.mockResolvedValue([]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a author by id', async () => {
            mockAuthorsService.findOne.mockResolvedValue(mockAuthor);

            const result = await controller.findOne(1);

            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockAuthor);
        });

        it('should throw NotFoundException when author not found', async () => {
            mockAuthorsService.findOne.mockRejectedValue(new NotFoundException('Author not found'));

            await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith(999);
        });
    });

    describe('update', () => {
        it('should update a author successfully', async () => {
            const updateData = { name: 'Updated Name' };
            const updatedAuthor = { ...mockAuthor, ...updateData };
            mockAuthorsService.update.mockResolvedValue(updatedAuthor);

            const result = await controller.update(1, updateData);

            expect(service.update).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedAuthor);
        });

        it('should throw NotFoundException when updating non-existent author', async () => {
            const updateData = { name: 'Updated Name' };
            mockAuthorsService.update.mockRejectedValue(new NotFoundException('Author not found'));

            await expect(controller.update(999, updateData)).rejects.toThrow(NotFoundException);
            expect(service.update).toHaveBeenCalledWith(999, updateData);
        });
    });

    describe('remove', () => {
        it('should remove a Author successfully', async () => {
            mockAuthorsService.remove.mockResolvedValue(undefined);

            await controller.remove(1);

            expect(service.remove).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when removing non-existent author', async () => {
            mockAuthorsService.remove.mockRejectedValue(new NotFoundException('Author not found'));

            await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
            expect(service.remove).toHaveBeenCalledWith(999);
        });
    });
});
});
