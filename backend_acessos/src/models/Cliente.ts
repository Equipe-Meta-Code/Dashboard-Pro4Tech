import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('cliente')
class Cliente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    Cliente: string;

    @Column({ type: 'varchar', nullable: true })
    CNPJ_CPF_Cliente: string;

    @Column({ type: 'varchar', nullable: true })
    Segmento_do_Cliente: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

export default Cliente;
