import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

export class ValidateLength implements PipeTransform {
  transform(value: CreateUserDto, _metadata: ArgumentMetadata) {
    const passwordError = value.password?.length > 50;
    const displayNameError = value.displayName?.length > 16;

    if (passwordError || displayNameError) {
      //Take a look at this later
      const errorString = [
        passwordError ? 'password field cannot exceed 50 characters' : '',
        displayNameError ? 'displayName field cannot exceed 16 characters' : '',
      ]
        .filter(Boolean)
        .join('\n');

      throw new HttpException(errorString, HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
