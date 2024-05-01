import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    nome_product: string;

    @Column('varchar')
    descricao: string;

    @Column('timestamp', { default: 'CURRENT_TIMESTAMP'} )
    data_criacao: Date;
}

export default Product;
