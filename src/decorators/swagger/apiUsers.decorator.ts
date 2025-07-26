import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from 'src/users/users.dto';

const BadRequestExample = {
  description: 'Bad Request Error',
  example: {
    errors: {
      username: [
        'username must be a string',
        'username must be longer than or equal to 3 characters',
        'username must be shorter than or equal to 20 characters',
      ],
      email: [
        'email must be an email',
        'email must be shorter than or equal to 100 characters',
      ],
      password: [
        'password is not strong enough',
        'password must be longer than or equal to 4 characters',
        'password must be shorter than or equal to 16 characters',
      ],
      property: [':propertyName should not exist'],
    },
    error: 'Bad Request',
    statusCode: 400,
  },
};

const ConflictExample = {
  description: 'Email already exists! || Username already exists!',
  example: [
    {
      message: 'Email already exists!',
      error: 'Conflict',
      statusCode: 409,
    },
    {
      message: 'Username already exists!',
      error: 'Conflict',
      statusCode: 409,
    },
  ],
};

const NotFoundUserExample = {
  description: 'User not found!',
  example: {
    message: 'User not found',
    error: 'Not Found',
    statusCode: 404,
  },
};

function ApiIdParam() {
  return ApiParam({
    name: 'id',
    description: "The 'id' of the user",
    example: '1',
  });
}

export function ApiGetAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Lists all users' }),
    ApiOkResponse({ type: [UserDTO] }),
  );
}

export function ApiGetUserById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by id' }),
    ApiOkResponse({ type: UserDTO }),
    ApiIdParam(),
    ApiNotFoundResponse(NotFoundUserExample),
  );
}

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Creates new user' }),
    ApiOkResponse({ type: UserDTO }),
    ApiBody({ type: CreateUserDTO }),
    ApiBadRequestResponse(BadRequestExample),
    ApiConflictResponse(ConflictExample),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Updates existing user' }),
    ApiOkResponse({ type: UserDTO }),
    ApiBody({ type: UpdateUserDTO }),
    ApiIdParam(),
    ApiBadRequestResponse(BadRequestExample),
    ApiConflictResponse(ConflictExample),
    ApiNotFoundResponse(NotFoundUserExample),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Deletes existing user' }),
    ApiIdParam(),
    ApiNoContentResponse(),
    ApiNotFoundResponse(NotFoundUserExample),
  );
}
