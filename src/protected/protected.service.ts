import { Injectable } from '@nestjs/common';
import { CreateProtectedDto } from './dto/create-protected.dto';
import { UpdateProtectedDto } from './dto/update-protected.dto';

@Injectable()
export class ProtectedService {
  create(createProtectedDto: CreateProtectedDto) {
    return 'This action adds a new protected';
  }

  findAll() {
    return `This action returns all protected`;
  }

  findOne(id: number) {
    return `This action returns a #${id} protected`;
  }

  update(id: number, updateProtectedDto: UpdateProtectedDto) {
    return `This action updates a #${id} protected`;
  }

  remove(id: number) {
    return `This action removes a #${id} protected`;
  }
}
