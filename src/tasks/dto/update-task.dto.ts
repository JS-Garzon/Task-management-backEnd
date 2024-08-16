import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  status?: string;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  user?: string;
}
