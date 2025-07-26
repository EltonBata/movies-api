import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Not, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private hashService: HashService,
  ) {}

  async getAll(): Promise<UserDTO[]> {
    try {
      const users = await this.userRepository.find();
      const usersDTO = plainToInstance(UserDTO, users, {
        excludeExtraneousValues: true,
      });

      return usersDTO;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number): Promise<UserDTO> {
    try {
      const user = await this.userRepository.findOneBy({ id: id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userDTO = plainToInstance(UserDTO, user, {
        excludeExtraneousValues: true,
      });

      return userDTO;
    } catch (error) {
      throw error;
    }
  }

  async save(createUserDTO: CreateUserDTO): Promise<UserDTO> {
    try {
      await this.validateCreateUniqueFields(createUserDTO);

      const user = plainToInstance(Users, createUserDTO);

      user.password = await this.hashService.hash(user.password);

      const savedUser = await this.userRepository.save(user);

      const savedUserDTO = plainToInstance(UserDTO, savedUser, {
        excludeExtraneousValues: true,
      });

      return savedUserDTO;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDTO: UpdateUserDTO): Promise<UserDTO> {
    try {
      const user = await this.userRepository.findOneBy({ id: id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.validateUpdateUniqueFields(id, updateUserDTO);

      const userToUpdate = this.userRepository.merge(user, updateUserDTO);

      if (updateUserDTO.password) {
        user.password = await this.hashService.hash(user.password);
      }

      const updatedUser = await this.userRepository.save(userToUpdate);

      const updatedUserDTO = plainToInstance(UserDTO, updatedUser, {
        excludeExtraneousValues: true,
      });

      return updatedUserDTO;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<[]> {
    try {
      const user = await this.userRepository.findOneBy({ id: id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.softDelete({ id: id });

      return [];
    } catch (error) {
      throw error;
    }
  }

  private async validateUpdateUniqueFields(
    id: number,
    updateUserDTO: UpdateUserDTO,
  ) {
    const emailAlreadyExists = await this.userRepository.existsBy({
      email: updateUserDTO.email,
      id: Not(id),
    });

    if (emailAlreadyExists) {
      throw new ConflictException('Email already exists!');
    }

    const usernameAlreadyExists = await this.userRepository.existsBy({
      username: updateUserDTO.username,
      id: Not(id),
    });

    if (usernameAlreadyExists) {
      throw new ConflictException('Username already exists!');
    }
  }

  private async validateCreateUniqueFields(createUserDTO: CreateUserDTO) {
    const emailAlreadyExists = await this.userRepository.existsBy({
      email: createUserDTO.email,
    });

    if (emailAlreadyExists) {
      throw new ConflictException('Email already exists!');
    }

    const usernameAlreadyExists = await this.userRepository.existsBy({
      username: createUserDTO.username,
    });

    if (usernameAlreadyExists) {
      throw new ConflictException('Username already exists!');
    }
  }
}
