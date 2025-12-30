import { IsString, IsOptional } from 'class-validator';

export class CreateImageDto {
  @IsString()
  section: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
