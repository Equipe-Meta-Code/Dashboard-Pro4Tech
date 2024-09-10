import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, path.resolve(__dirname, '../public/upload/xlsx'));
    },
    filename: (req: Request, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filtragem de tipo de arquivo
const fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void = (req, file, cb) => {
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não suportado') as any, false); // Cast para any
    }
};

// Configuração do multer
const upload = multer({
    storage,
    fileFilter
});

export default upload;
