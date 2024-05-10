import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: TasksRepository
    ) { }

    async getTasks({ search, status }: GetTasksFilterDto, user: User): Promise<Task[]> {
        const query = this.tasksRepository.createQueryBuilder('task');
        query.where({ user })

        if (search) {
            query.andWhere(
                'task.title ILIKE :search OR task.description ILIKE :search',
                { search: `%${search}%` }
            )
        }
        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        const tasks = await query.getMany()
        return tasks;
    }

    async createTask({ title, description }: CreateTaskDto, user: User): Promise<Task> {
        const task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        })

        await this.tasksRepository.save(task)

        return task;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOne({
            where: { id, user }
        })

        if (!found) throw new NotFoundException()

        return found;
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.tasksRepository.delete({ id, user })
        if (result.affected === 0) throw new NotFoundException(`id ${id} not found`)
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        await this.tasksRepository.save(task)

        return task;
    }
}
