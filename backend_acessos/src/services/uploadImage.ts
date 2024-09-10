import multer, { StorageEngine } from 'multer';
import path from 'path';

// Configuração do armazenamento do multer
const storage: StorageEngine = multer.diskStorage({
    // Local para salvar a imagem
    destination: (req, file, cb) => {
        cb(null, './public/upload/users');
    },
    // Nome que deve ser atribuído ao arquivo
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + path.extname(file.originalname));
    }
});

// Validação da extensão do arquivo
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Exportar o middleware de upload
export default multer({ storage, fileFilter });
