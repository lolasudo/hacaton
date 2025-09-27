import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserSchemaClass } from '../../../../users/infrastructure/persistence/document/entities/user.schema';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly model: Model<UserSchemaClass>,
  ) {}

  async run() {
    // ✅ Создаем ADMIN пользователя
    const admin = await this.model.findOne({
      email: 'admin@example.com',
    });

    if (!admin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'admin@example.com',
        password: password,
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+7 (999) 111-11-11', // ✅ ДОБАВЛЕНО phone
        role: {
          _id: RoleEnum.ADMIN.toString(),
        },
        status: {
          _id: StatusEnum.active.toString(),
        },
      });
      await data.save();
    }

    // ✅ Создаем CONTRACTOR пользователя (прораб)
    const contractor = await this.model.findOne({
      email: 'contractor@example.com',
    });

    if (!contractor) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'contractor@example.com',
        password: password,
        firstName: 'Иван',
        lastName: 'Петров',
        phone: '+7 (999) 222-22-22', // ✅ ДОБАВЛЕНО phone
        role: {
          _id: RoleEnum.CONTRACTOR.toString(),
        },
        status: {
          _id: StatusEnum.active.toString(),
        },
      });

      await data.save();
    }

    // ✅ Создаем CUSTOMER пользователя (заказчик)
    const customer = await this.model.findOne({
      email: 'customer@example.com',
    });

    if (!customer) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'customer@example.com',
        password: password,
        firstName: 'Алексей',
        lastName: 'Сидоров',
        phone: '+7 (999) 333-33-33', // ✅ ДОБАВЛЕНО phone
        role: {
          _id: RoleEnum.CUSTOMER.toString(),
        },
        status: {
          _id: StatusEnum.active.toString(),
        },
      });

      await data.save();
    }

    // ✅ Создаем INSPECTOR пользователя (инспектор)
    const inspector = await this.model.findOne({
      email: 'inspector@example.com',
    });

    if (!inspector) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'inspector@example.com',
        password: password,
        firstName: 'Мария',
        lastName: 'Иванова',
        phone: '+7 (999) 444-44-44', // ✅ ДОБАВЛЕНО phone
        role: {
          _id: RoleEnum.INSPECTOR.toString(),
        },
        status: {
          _id: StatusEnum.active.toString(),
        },
      });

      await data.save();
    }
  }
}