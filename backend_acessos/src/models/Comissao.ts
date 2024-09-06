import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('comissao')
class Comissao {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    Vendedor: string;

    @Column({ type: 'varchar', nullable: true })
    CPF_Vendedor: string;

    @Column({ type: 'varchar', nullable: true })
    Produto: string;

    @Column({ type: 'varchar', nullable: true })
    ID_Produto: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    Valor_da_Venda: number;

    @Column({ type: 'varchar', nullable: true })
    Tipo_de_Venda: string;

    @Column({ type: 'varchar', nullable: true })
    Porcentagem: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

export default Comissao;
