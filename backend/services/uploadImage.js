// Incluir as bibliotecas
// Upload de arquivos
const multer  = require('multer');

// O módulo path permite interagir com o sistema de arquivos
const path = require('path');

// Realizar upload da imagem
module.exports = (multer({

    // diskStorage permite manipular locar para salvar a imagem
    storage: multer.diskStorage({

        // Local para salvar a imagem
        destination: (req, file, cb) => {
            cb(null, './public/upload/users')
        },

        // Nome que deve ser atribuido ao arquivo
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + path.extname(file.originalname))
        }
    }),

    // Validar a extensão do arquivo
    fileFilter: (req, file, cb) => {

        // Verificar se a extensão da imagem enviada pelo usuário está no array de extensões
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(null, false);
          }
    }
}))