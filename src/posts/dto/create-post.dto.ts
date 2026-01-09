import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  userName: string;

  @IsString()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];
}
