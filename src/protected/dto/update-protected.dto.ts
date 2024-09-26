import { PartialType } from '@nestjs/mapped-types';
import { CreateProtectedDto } from './create-protected.dto';

export class UpdateProtectedDto extends PartialType(CreateProtectedDto) {}
