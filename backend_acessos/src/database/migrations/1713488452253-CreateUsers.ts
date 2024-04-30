import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1713488452253 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'nome',
                        type: 'varchar',
                        length: '150',
                        isNullable: false
                    },
                    {
                        name: 'cpf',
                        type: 'varchar',
                        length: '60',
                        isNullable: false
                    },
                    {
                        name: 'login',
                        type: 'varchar',
                        length: '100',
                        isNullable: true
                    },
                    {
                        name: 'senha',
                        type: 'varchar',
                        length: '100',
                        isNullable: true
                    },
                    {
                        name: "data_criacao",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
