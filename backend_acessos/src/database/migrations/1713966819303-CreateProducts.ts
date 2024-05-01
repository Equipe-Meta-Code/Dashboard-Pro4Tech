import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProducts1713966819303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'nome_product',
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
        await queryRunner.dropTable("products");
    }

}
