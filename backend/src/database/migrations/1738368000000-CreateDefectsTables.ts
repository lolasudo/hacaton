import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDefectsTables1738368000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создаем таблицу defects
        await queryRunner.createTable(new Table({
            name: 'defects',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['open', 'in_progress', 'fixed', 'verified', 'rejected'],
                    default: "'open'",
                },
                {
                    name: 'priority',
                    type: 'enum',
                    enum: ['low', 'medium', 'high', 'critical'],
                    default: "'medium'",
                },
                {
                    name: 'dueDate',
                    type: 'timestamp',
                },
                {
                    name: 'latitude',
                    type: 'decimal',
                    precision: 10,
                    scale: 8,
                    isNullable: true,
                },
                {
                    name: 'longitude',
                    type: 'decimal',
                    precision: 11,
                    scale: 8,
                    isNullable: true,
                },
                {
                    name: 'photos',
                    type: 'jsonb',
                    default: "'[]'",
                },
                {
                    name: 'objectId',
                    type: 'int',
                },
                {
                    name: 'createdById',
                    type: 'int',
                },
                {
                    name: 'assignedToId',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'category',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'requiresVerification',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'fixedAt',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'verifiedAt',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }), true);

        // Создаем таблицу violations
        await queryRunner.createTable(new Table({
            name: 'violations',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['open', 'in_progress', 'fixed', 'verified'],
                    default: "'open'",
                },
                {
                    name: 'classificationCode',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'classificationDescription',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'latitude',
                    type: 'decimal',
                    precision: 10,
                    scale: 8,
                },
                {
                    name: 'longitude',
                    type: 'decimal',
                    precision: 11,
                    scale: 8,
                },
                {
                    name: 'photos',
                    type: 'jsonb',
                    default: "'[]'",
                },
                {
                    name: 'objectId',
                    type: 'int',
                },
                {
                    name: 'createdById',
                    type: 'int',
                },
                {
                    name: 'assignedToId',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'dueDate',
                    type: 'timestamp',
                },
                {
                    name: 'requiresLabSamples',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'labSampleDetails',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }), true);

        // Создаем таблицу comments
        await queryRunner.createTable(new Table({
            name: 'comments',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'text',
                    type: 'text',
                },
                {
                    name: 'defectId',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'violationId',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'createdById',
                    type: 'int',
                },
                {
                    name: 'type',
                    type: 'varchar',
                    length: '20',
                    default: "'user'",
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }), true);

        // 🔥 ВРЕМЕННО УБИРАЕМ ВНЕШНИЕ КЛЮЧИ НА USERS - ДОБАВИМ ПОЗЖЕ
        
        // Только внешний ключ на construction_objects (он существует)
        await queryRunner.createForeignKey('defects', new TableForeignKey({
            columnNames: ['objectId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'construction_objects',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('violations', new TableForeignKey({
            columnNames: ['objectId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'construction_objects',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('comments', new TableForeignKey({
            columnNames: ['defectId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'defects',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('comments', new TableForeignKey({
            columnNames: ['violationId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'violations',
            onDelete: 'CASCADE',
        }));

        // 🔥 ВНЕШНИЕ КЛЮЧИ НА USERS ПОКА НЕ ДОБАВЛЯЕМ - ТАБЛИЦА USERS НЕ СУЩЕСТВУЕТ
        /*
        await queryRunner.createForeignKey('defects', new TableForeignKey({
            columnNames: ['createdById'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('defects', new TableForeignKey({
            columnNames: ['assignedToId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));

        await queryRunner.createForeignKey('violations', new TableForeignKey({
            columnNames: ['createdById'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('violations', new TableForeignKey({
            columnNames: ['assignedToId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));

        await queryRunner.createForeignKey('comments', new TableForeignKey({
            columnNames: ['createdById'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        */
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comments');
        await queryRunner.dropTable('violations');
        await queryRunner.dropTable('defects');
    }
}