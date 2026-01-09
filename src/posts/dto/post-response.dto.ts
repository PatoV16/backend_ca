export class PostResponseDto {
  id: number;
  userName: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  comments: number;
  imageUrls: string[];
}
