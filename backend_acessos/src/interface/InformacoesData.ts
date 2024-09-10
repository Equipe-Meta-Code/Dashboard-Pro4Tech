export interface InformacoesData {
    id: number;
    Data_da_Venda?: Date;
    Vendedor?: string;
    CPF_Vendedor?: string;
    Produto?: string;
    ID_Produto?: string;
    Cliente?: string;
    CNPJ_CPF_Cliente?: string;
    Segmento_do_Cliente?: string;
    Valor_de_Venda?: number;
    Forma_de_Pagamento?: string;
    createdAt: Date;
    updatedAt: Date;
}
