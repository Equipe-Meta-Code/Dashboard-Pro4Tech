import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateInformacoes1725635335401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'informacoes',
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
                    name: 'Data_da_Venda',
                    type: 'date',
                    isNullable: true,
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
                    name: 'Cliente',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'CNPJ_CPF_Cliente',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Segmento_do_Cliente',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Valor_de_Venda',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'Forma_de_Pagamento',
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
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("informacoes");
    }

}
