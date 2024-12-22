import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserParams } from './types/createUserParams';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  fetch() {
    try {
      return this.userRepository.find();
    } catch (err) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchOne(uuid: string) {
    try {
      //Attempt to find user
      const user = await this.userRepository.findOne({ where: { id: uuid } });

      //If user's null we throw an HttpException with a status code of 404
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      //If all goes well, returns user
      return user;
    } catch (err) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  createUser(userData: CreateUserParams) {
    try {
      //Creates an instance of user (based on the entity class)
      const newUser = this.userRepository.create(userData);

      //Save entity instance to database
      return this.userRepository.save(newUser);
    } catch (err) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(uuid: string, userData: UpdateUserDto) {
    try {
      const { confirmPassword, ...updateDetails } = userData;
      //Making sure the user we want to update exists in the first place
      const user = await this.userRepository.findOne({ where: { id: uuid } });

      //If user does not exist
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const updateData = await this.userRepository.update(
        { id: uuid },
        { ...updateDetails },
      );

      if (updateData.affected === 0)
        throw new HttpException('No changes were made', HttpStatus.BAD_REQUEST);

      return this.fetchOne(uuid);
      //catch does not account for length errors when inserting
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  deleteUser(uuid: string) {
    try {
      return this.userRepository.delete({ id: uuid });
    } catch (err) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
