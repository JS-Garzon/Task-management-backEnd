import { CreateTaskDto } from './dto/create-task.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Model } from 'mongoose';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findById(id: string) {
    const existingTask = await this.taskModel.findById(id).exec();
    if (!existingTask) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }
    return existingTask;
  }

  async findByUser(userId: string) {
    const existingTasks = await this.taskModel.find({ user: userId }).exec();
    if (!existingTasks) {
      throw new NotFoundException('Not data');
    }
    return existingTasks;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: any) {
    const existingTask = await this.findById(id);
    if (
      existingTask.user?.toString() !== user.sub &&
      !this.isAdmin(user.roles)
    ) {
      throw new ForbiddenException('You are not allowed to update this task');
    }
    return this.taskModel.findByIdAndUpdate(
      id,
      { $set: updateTaskDto },
      { new: true, runValidators: true },
    );
  }

  async delete(id: string) {
    const existingTask = await this.taskModel.findByIdAndDelete(id);
    if (!existingTask) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }
    return this.findAll();
  }

  private isAdmin(userRole: string): boolean {
    const isAdmin = userRole.includes('admin');
    return isAdmin;
  }
}
