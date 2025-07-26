import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/match-password.decorator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'test123',
  })
  @MaxLength(20)
  @MinLength(3)
  @IsString()
  username: string;

  @ApiProperty({
    example: 'test@app.com',
  })
  @MaxLength(100)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Test123@',
  })
  @MaxLength(16)
  @MinLength(4)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({
    example: 'Test1234@',
  })
  @MatchPassword('password')
  password_confirmation: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  //   @ApiPropertyOptional({
  //     example: 'test123',
  //   })
  //   @IsString()
  //   @IsOptional()
  //   @MinLength(3)
  //   @MaxLength(20)
  //   username?: string;

  //   @ApiPropertyOptional({
  //     example: 'test123',
  //   })
  //   @IsEmail()
  //   @IsOptional()
  //   @MaxLength(100)
  //   email?: string;

  //   @ApiPropertyOptional({
  //     example: 'test123@',
  //   })
  //   @IsString()
  //   @IsOptional()
  //   @MinLength(8)
  //   @MaxLength(16)
  //   @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  // })
  //   password?: string;

  @ValidateIf((field) => field.password !== undefined)
  @ApiPropertyOptional({
    example: 'test123@',
  })
  @IsString()
  @IsOptional()
  @MatchPassword('password')
  password_confirmation?: string;
}

export class UserDTO {
  @ApiProperty({
    example: '1',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'test123',
  })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'test@app.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'true',
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    example: '2025-07-26T12:16:59.398Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-26T12:16:59.398Z',
  })
  @Expose()
  updatedAt: Date;
}
