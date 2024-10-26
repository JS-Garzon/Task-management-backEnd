import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).exec();
  }
  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    if (file) {
      const photoPath = path.join('uploads', 'profile_pics');
      // Eliminar la foto anterior si existe
      const existingUser = await this.userModel.findById(id).exec();
      if (existingUser && existingUser.photo) {
        const oldPhotoPath = path.normalize(existingUser.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      // Guardar la nueva imagen
      const filePath = path.join(photoPath, file.filename);

      const buffer = await fs.promises.readFile(file.path);
      fs.writeFileSync(filePath, buffer);

      // Actualizar DTO con la ruta de la nueva imagen
      updateUserDto.photo = filePath.replace(/\\/g, '/');
    }
    const existingUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true, runValidators: true },
    );
    if (!existingUser) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return existingUser;
  }

  async delete(id: string) {
    const existingUser = await this.userModel.findByIdAndDelete(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return this.findAll();
  }
}
