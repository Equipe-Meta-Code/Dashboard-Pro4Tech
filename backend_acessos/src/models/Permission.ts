import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("permissions")
class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    nome_permission: string;

    @Column('varchar')
    descricao: string;

    @Column('timestamp', { default: 'CURRENT_TIMESTAMP'} )
    data_criacao: Date;
}

export default Permission;
