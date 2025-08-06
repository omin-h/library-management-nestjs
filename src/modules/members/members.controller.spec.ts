import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './members.entity';

describe('MemberController' , () => {
    let controller: MembersController;
    let service: MembersService;

    const mockMember: Member = {
        id: 2344,
        name: 'Donald Trump',
        email: 'info@donld.com',
        joinedDate: '2025/1/1',
    };

    const mockMembersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

     beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                controllers: [MembersController],
                providers: [
                    {
                        provide: MembersService,
                        useValue: mockMembersService,
                    },
                ],
            }).compile();

        controller = module.get<MembersController>(MembersController);
        service = module.get<MembersService>(MembersService);
    });

        afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a member successfully', async () => {
            const createMemberDto = { name: 'Test Name', email: 'test@example.com', joinedDate: '2025/1/1' };
            mockMembersService.create.mockResolvedValue(mockMember);
            const result = await controller.create(createMemberDto);
            expect(service.create).toHaveBeenCalledWith(createMemberDto);
            expect(result).toEqual(mockMember);
            });     


            it('should throw BadRequestException when name is missing', async () => {
            const createMemberDto = { email: 'test@example.com', joinedDate: '2025/1/1' };
            await expect(controller.create(createMemberDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
            });


            it('should throw BadRequestException when email is missing', async () => {
            const createMemberDto = { name: 'Test Name', joinedDate: '2025/1/1' };
            await expect(controller.create(createMemberDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
            });

            it('should throw BadRequestException when joinedDate is missing', async () => {
            const createMemberDto = { name: 'Test Name', email: 'test@example.com' };
            await expect(controller.create(createMemberDto as any)).rejects.toThrow(BadRequestException);
            expect(service.create).not.toHaveBeenCalled();
        });



    describe('findAll', () => {
        it('should return an array of members', async () => {
            const mockMembers = [mockMember];
            mockMembersService.findAll.mockResolvedValue(mockMembers);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockMembers);
        });

        it('should return empty array when no members exist', async () => {
            mockMembersService.findAll.mockResolvedValue([]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
    

    describe('findOne', () => {
        it('should return a member by id', async () => {
            mockMembersService.findOne.mockResolvedValue(mockMember);

            const result = await controller.findOne(1);

            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockMember);
        });

        it('should throw NotFoundException when member not found', async () => {
            mockMembersService.findOne.mockRejectedValue(new NotFoundException('Member not found'));

            await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith(999);
        });
    });


    describe('update', () => {
        it('should update a member successfully', async () => {
            const updateData = { name: 'Updated name' };
            const updatedMember = { ...mockMember, ...updateData };
            mockMembersService.update.mockResolvedValue(updatedMember);

            const result = await controller.update(1, updateData);

            expect(service.update).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedMember);
        });

        it('should throw NotFoundException when updating non-existent member', async () => {
            const updateData = { name: 'Updated name' };
            mockMembersService.update.mockRejectedValue(new NotFoundException('Member not found'));

            await expect(controller.update(999, updateData)).rejects.toThrow(NotFoundException);
            expect(service.update).toHaveBeenCalledWith(999, updateData);
        });
    });


    describe('remove', () => {
        it('should remove a member successfully', async () => {
            mockMembersService.remove.mockResolvedValue(undefined);

            await controller.remove(1);

            expect(service.remove).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when removing non-existent member', async () => {
            mockMembersService.remove.mockRejectedValue(new NotFoundException('Member not found'));

            await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
            expect(service.remove).toHaveBeenCalledWith(999);
        });
    });
});
});
