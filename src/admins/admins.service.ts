import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    // ในโปรเจคจริง ต้อง hash password ก่อนบันทึก
    const admin = this.adminsRepository.create(createAdminDto);
    return this.adminsRepository.save(admin);
  }

  findAll(): Promise<Admin[]> {
    return this.adminsRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminsRepository.findOneBy({ id_admin: id });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminsRepository.preload({
      id_admin: id,
      ...updateAdminDto,
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return this.adminsRepository.save(admin);
  }

  async remove(id: number): Promise<void> {
    const result = await this.adminsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }
}