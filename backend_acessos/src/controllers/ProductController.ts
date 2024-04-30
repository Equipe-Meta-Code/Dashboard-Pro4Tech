import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import Product from "../models/Product";

class ProductController {
    async create(request: Request, response: Response) {

        const productRepository = AppDataSource.getRepository(Product);

        const { nome_product, descricao } = request.body;
        
        const existProduct = await productRepository.findOneBy({nome_product});

        if(existProduct) {
            return response.status(400).json({error: "Product already exists!"});
        }

        const product = productRepository.create({
            nome_product,
            descricao
        });

        await productRepository.save(product);

        return response.json(product);
    }

    async index(request: Request, response: Response) {
        const productRepository = AppDataSource.getRepository(Product);

        const products = await productRepository.find();

        return response.json(products);
    }

    async show(request: Request, response: Response) {
        const productRepository = AppDataSource.getRepository(Product);

        const { id } = request.params;

        const product = await productRepository.findOne({ where: { id: Number(id) } }); 

        return response.json(product);
    }
}

export default new ProductController();