import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('informacoes')
class Informacoes {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: true })
    Data_da_Venda: Date;

    @Column({ type: 'varchar', nullable: true })
    Vendedor: string;

    @Column({ type: 'varchar', nullable: true })
    CPF_Vendedor: string;

    @Column({ type: 'varchar', nullable: true })
    Produto: string;

    @Column({ type: 'varchar', nullable: true })
    ID_Produto: string;

    @Column({ type: 'varchar', nullable: true })
    Cliente: string;

    @Column({ type: 'varchar', nullable: true })
    CNPJ_CPF_Cliente: string;

    @Column({ type: 'varchar', nullable: true })
    Segmento_do_Cliente: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    Valor_de_Venda: number;

    @Column({ type: 'varchar', nullable: true })
    Forma_de_Pagamento: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

export default Informacoes;