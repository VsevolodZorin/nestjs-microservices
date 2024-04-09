import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../local-files/storage';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // async getProfile(@CurrentUser('id') id: number) {
  //   return this.usersService.getProfile(id);
  // }

  // @Post('avatar')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: fileStorage,
  //   }),
  // )
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // async addAvatar(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
  //         new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png)$/ }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @CurrentUser('id') userId: number,
  // ) {
  //   return this.usersService.addAvatar(userId, file);
  // }
}
