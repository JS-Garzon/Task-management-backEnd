import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @Roles('user', 'admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @Roles('admin')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      // dest: './uploads/profile_pics',
      storage: diskStorage({
        destination: './uploads/profile_pics',
        filename: (req, file, cb) => {
          const uniqueFileName = uuidv4() + path.extname(file.originalname);
          cb(null, uniqueFileName);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    return this.usersService.update(id, payload, file);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
