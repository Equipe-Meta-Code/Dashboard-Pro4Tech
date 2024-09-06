import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('vendedor')
class Vendedor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    Vendedor: string;

    @Column({ type: 'varchar', nullable: true })
    CPF_Vendedor: string;

    @Column({ type: 'varchar', nullable: true })
    Email: string;

    @Column({ type: 'varchar', nullable: true })
    Telefone: string;

    @Column({ type: 'varchar', nullable: true })
    Endereco: string;

    @Column({ type: 'varchar', nullable: true })
    Pais: string;

    @Column({ type: 'date', nullable: true })
    Data_Nascimento: Date;

    @Column({ type: 'varchar', nullable: true })
    foto: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

export default Vendedor;
