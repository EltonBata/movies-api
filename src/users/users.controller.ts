import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDTO, UserDTO } from './users.dto';
import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiGetAllUsers,
  ApiGetUserById,
  ApiUpdateUser,
} from 'src/decorators/swagger/apiUsers.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiGetAllUsers()
  @Get()
  async gelAll(): Promise<UserDTO[]> {
    const users = await this.userService.getAll();

    return users;
  }

  @ApiGetUserById()
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
    const user = await this.userService.getById(id);

    return user;
  }

  @ApiCreateUser()
  @Post()
  @HttpCode(201)
  async create(@Body() userDTO: CreateUserDTO): Promise<UserDTO> {
    const savedUser = await this.userService.save(userDTO);

    return savedUser;
  }

  @ApiUpdateUser()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDTO: CreateUserDTO,
  ): Promise<UserDTO> {
    const updatedUser = await this.userService.update(id, userDTO);

    return updatedUser;
  }

  @ApiDeleteUser()
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id:number): Promise<[]>{

    return await this.userService.delete(id);

  }
}
