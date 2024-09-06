import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVendedor1725647218438 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'vendedor',
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
                    name: 'Email',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Telefone',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Endereco',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Pais',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'Data_Nascimento',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'foto',
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
        await queryRunner.dropTable("vendedor");
    }

}
