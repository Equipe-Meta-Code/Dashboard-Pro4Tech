// Incluir as bibliotecas
// Upload de arquivos
const multer  = require('multer');

// O módulo path permite interagir com o sistema de arquivos
const path = require('path');

// Realizar upload do arquivo
module.exports = (multer({

    // diskStorage permite manipular locar para salvar o arquivo
    storage: multer.diskStorage({

        // Local para salvar o arquivo
        destination: (req, file, cb) => {
            cb(null, './public/upload/xlsx')
        },

        // Nome que deve ser atribuido ao arquivo
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
        }
    }),

    // Validar a extensão do arquivo
    fileFilter: (req, file, cb) => {

        // Verificar se a extensão do arquivo enviado pelo usuário está no array de extensões
        const extesaoImg = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].find(formatoAceito => formatoAceito == file.mimetype);

        // Retornar TRUE quando a extensão do arquivo é válido
        if(extesaoImg){
            return cb(null, true);
        }

        // Retornar FALSE quando a extensão do arquivo é inválido
        return cb(null, false);
    }
}))