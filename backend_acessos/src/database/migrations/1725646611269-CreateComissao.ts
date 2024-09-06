import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateComissao1725646611269 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'comissao',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isNullable: false,
                },
                {
                    name: 'Vendedor',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'CPF_Vendedor',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Produto',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'ID_Produto',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Valor_da_Venda',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'Tipo_de_Venda',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Porcentagem',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("comissao");
    }

}
