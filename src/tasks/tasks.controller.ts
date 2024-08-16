import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
export class TasksController {
  constructor(@Inject() private tasksService: TasksService) {}
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @Roles('user', 'admin')
  findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Get('/user/:userId')
  @Roles('user', 'admin')
  findByUser(@Param('userId') userId: string) {
    return this.tasksService.findByUser(userId);
  }

  @Patch(':id')
  @Roles('user', 'admin')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateTaskDto,
    @Request() req,
  ) {
    const user = req.user;
    return this.tasksService.update(id, payload, user);
  }

  @Delete(':id')
  @Roles('user', 'admin')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
