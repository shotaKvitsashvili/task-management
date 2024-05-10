import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [TasksController],
    providers: [TasksService],
    imports: [
        TypeOrmModule.forFeature([Task]),
        AuthModule
    ],
})
export class TasksModule { }
