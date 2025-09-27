import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { RoleEnum } from '../../../../roles/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    // ✅ Создаем ADMIN роль
    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.ADMIN,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.ADMIN,
          name: 'Admin',
        }),
      );
    }

    // ✅ Создаем CUSTOMER роль
    const countCustomer = await this.repository.count({
      where: {
        id: RoleEnum.CUSTOMER,
      },
    });

    if (!countCustomer) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.CUSTOMER,
          name: 'Customer',
        }),
      );
    }

    // ✅ Создаем CONTRACTOR роль
    const countContractor = await this.repository.count({
      where: {
        id: RoleEnum.CONTRACTOR,
      },
    });

    if (!countContractor) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.CONTRACTOR,
          name: 'Contractor',
        }),
      );
    }

    // ✅ Создаем INSPECTOR роль
    const countInspector = await this.repository.count({
      where: {
        id: RoleEnum.INSPECTOR,
      },
    });

    if (!countInspector) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.INSPECTOR,
          name: 'Inspector',
        }),
      );
    }
  }
}