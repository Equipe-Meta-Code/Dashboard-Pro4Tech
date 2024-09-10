export interface ComissaoData {
    id: number;
    Vendedor?: string;
    CPF_Vendedor?: string;
    Produto?: string;
    ID_Produto?: string;
    Valor_da_Venda?: number;
    Tipo_de_Venda?: string;
    Porcentagem?: string;
    createdAt: Date;
    updatedAt: Date;
}
