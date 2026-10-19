const Ciclista = require('../models/Ciclista')
const Crypto = require('crypto-js')
const CHAVE_SECRETA = 'nuvem'

const login = async (req, res) => {
    const valores = req.body
    console.log(valores)

    if (!valores.email || !valores.senha) {
        return res.status(400).json({ message: 'Email ou senha incorretos!' })
    }

    try {
        const ciclista = await Ciclista.findOne({ where: { email: valores.email } })

        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista nn encontrado' })
        }

        const bytes = Crypto.AES.decrypt(ciclista.senha, CHAVE_SECRETA)
        console.log(bytes)

        const senhaBD = bytes.toString(Crypto.enc.Utf8)
        console.log(bytes)

        if (valores.senha !== senhaBD) {
            return res.status(401).json({ message: 'Senha incorreta' })
        }

        const TresHorasEmMs = 3 * 60 * 60 * 1000
        const tempoExpiracao = Date.now() + TresHorasEmMs

        const payload = {
            idCiclista: ciclista.idCiclista,
            nome: ciclista.nome,
            expiraEm: tempoExpiracao
        }

        const token = Crypto.AES.encrypt(JSON.stringify(payload), CHAVE_SECRETA).toString()

        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            token: token,
            nome: ciclista.nome,
        })
    } catch (err) {
        console.error('Erro ao tentar fazer o login:', err)
        return res.status(500).json({ message: 'Erro ao tentar fazer o login!' })
    }
}


module.exports = { login }