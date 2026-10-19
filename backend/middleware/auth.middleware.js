const cryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'nuvem'

function authMiddleware(req, res, next) {
    const token = req.headers['authorization']
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' })
    }

    try {
        const bytes = cryptoJS.AES.decrypt(token, CHAVE_SECRETA)
        const dadosDescriptografados = bytes.toString(cryptoJS.enc.Utf8)

        if (!dadosDescriptografados) {
            return res.status(401).json({ message: 'Token inválido' })
        }

        const payload = JSON.parse(dadosDescriptografados)

        if (Date.now() > payload.ExpiraEM) {
            return res.status(401).json({ message: 'Token expirado!' })
        }

        req.usuario = payload

        next()
    } catch (err) {
        res.status(401).json({ message: 'Falha na autenticação do token' })
    }
}

module.exports = authMiddleware