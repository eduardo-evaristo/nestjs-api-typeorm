import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

//Custom pipe to validate 'password' and 'confirmPassword' fields
export class ValidatePassword implements PipeTransform {
  transform(value: CreateUserDto, _metadata: ArgumentMetadata) {
    if (value.password !== value.confirmPassword)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    return value;
  }
}
