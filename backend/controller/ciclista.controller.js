const Ciclista = require('../models/Ciclista')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'nuvem'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.celular || !valores.endereco) {
        return res.status(401).json({ message: 'Todos os dados devem ser inseridos corretamente' })
    }
    if (valores != 11) {
        return res.status(401).json({ message: 'Todos os dados devem ser inseridos corretamente' })
    }

    try {
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        const senhaCriptografada = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await Ciclista.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada,
            cpf: cpfCriptografado,
            celular: valores.celular,
            endereco: valores.endereco
        })


        return res.status(201).json({ message: 'Todos os dados devem ser inseridos corretamente' })
    } catch (err) {
        console.error('Erro ao tentar realizar a operação', err)
        return res.status(500).json({ message: 'Erro ao tentar realizar a operação' })
    }
}

const listar = async (req, res) => {
    try {
        const ciclistas = await Ciclista.findAll()
        let resultado = []

        ciclistas.forEach((el) => {
            let cpfDescriptografado = ''

            try {
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
            } catch (err) {
                cpfDescriptografado = 'Erro ao descriptografar o CPF'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codCiclista: el.codCiclista,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                celular: el.celular,
                endereco: el.endereco
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro ao tentar realizar a operação', err)
        return res.status(500).json({ message: 'Erro ao tentar realizar a operação' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const ciclistas = await Ciclista.findByPk(id)
        if (!ciclista) {
            return res.status(404).json({ message: 'Usuário não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(ciclistas.cpf, CHAVE_SECRETA)
        console.log('bytes', bytes)

        const cpfDescriptografado = bytes.toString(cryptoJS.enc.Utf8)
        console.log('cpfDescriptografado: ', cpfDescriptografado)

        return res.status(200).json({
            codCiclista: ciclista.codCiclista,
            nome: ciclista.nome,
            email: ciclista.email,
            cpf: cpfDescriptografado,
            endereco: ciclista.endereco,
            celular: ciclista.celular
        })
    } catch (err) {
        console.error('Erro ao consultar ciclista:', err)
        return res.status(500).json({ message: 'Erro ao consultar ciclista!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const ciclistas = await Ciclista.findByPk(id)
        if (!ciclista) {
            return res.status(404).json({ message: 'Usuário não encontrado!' })
        }

        const dadosAtualizados = { ...valores }

        if (valores.cpf) {
            if (valores.cpf.length != 11) {
                return res.status(400).json({ message: 'O CPF deve conter 11 caracteres' })
            }
            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        } if (valores.senha) {
            return res.status(400).json({ message: 'O CPF deve conter 11 caracteres' })
        }
        dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        await Ciclista.update(dadosAtualizados, { where: { codCiclista: id } })
        return res.status(200).json({ message: 'Ciclista atualizado com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar ciclista:', err)
        return res.status(500).json({ message: 'Erro ao atualizar ciclista!' })
    }
}


const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const ciclista = await Ciclista.findByPk(id)
        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista não encontrado!' })
        }

        await Ciclista.destroy({ where: { codCiclista: id } })
        return res.status(200).json({ message: 'Ciclista excluído com sucesso!' })
    } catch (err) {
        console.error('Erro ao apagar ciclista:', err)
        return res.status(500).json({ message: 'Erro ao apagar ciclista!' })
    }
}

const consultarNome = async (req, res) => {
    const nome = req.params.nome

    try {
        const ciclista = await Ciclista.findOne({ where: { nome: nome } })

        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(ciclista.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codCiclista: ciclista.codCiclista,
            nome: ciclista.nome,
            email: ciclista.email,
            cpf: cpfDescriptografado,
            endereco: ciclista.endereco,
            celular: ciclista.celular
        })
    } catch (err) {
        console.error('Erro ao consultar ciclista por nome:', err)
        return res.status(500).json({ message: 'Erro ao consultar ciclista por nome!' })
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar, consultarNome }