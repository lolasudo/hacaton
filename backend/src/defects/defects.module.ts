import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Defect } from './entities/defect.entity';
import { Violation } from './entities/violation.entity';
import { Comment } from './entities/comment.entity';
import { DefectsService } from './services/defects.service';
import { ViolationsService } from './services/violations.service';
import { CommentsService } from './services/comments.service';
import { DefectsController } from './controllers/defects.controller';
import { ViolationsController } from './controllers/violations.controller';
import { CommentsController } from './controllers/comments.controller';
import { ConstructionObjectsModule } from '../construction-objects/construction-objects.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Defect, Violation, Comment]),
    ConstructionObjectsModule,
    UsersModule,
  ],
  controllers: [DefectsController, ViolationsController, CommentsController],
  providers: [DefectsService, ViolationsService, CommentsService],
  exports: [DefectsService, ViolationsService],
})
export class DefectsModule {}
