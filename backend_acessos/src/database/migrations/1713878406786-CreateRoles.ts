import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRoles1713878406786 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "roles",
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'nome_role',
                        type: 'varchar',
                    },
                    {
                        name: 'descricao',
                        type: 'varchar',
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
        await queryRunner.dropTable("roles");
    }

}
