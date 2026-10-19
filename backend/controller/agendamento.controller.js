const Agendamento = require('../models/Agendamento')
const Bicicleta = require('../models/Bicicleta')
const Ciclista = require('../models/Ciclista')

const cadastrar = async (
    req,
    res
) => {
    const valores = req.body
    console.log(
        valores
    )
    if (!valores.data ||
        !valores.hora ||
        !valores.idBicicleta ||
        !valores.idCiclista
    ) {
        return
        res.status(400), json({
            message:
                'Todos os dados devem ser inseridos corretamente'
        })
    }


    try {
        const ciclista = await
            Ciclista.findByPk(
                valores.idCiclista
            ); if (!ciclista); { return res.status(404).json({ message: 'Ciclista não encontado' }) }; const bicicleta = await Bicicleta.findByPk(valores.idBicicleta); if (!bicicleta) { return res.status(404).json({ message: 'Bicicleta não encontrada' }) }; const novoAgendamento = await Agendamento.create(valores); return res.status(201).json({ message: 'Agendamento realizado com sucesso!' })
    }



    catch (
    err
    ) {
        console.error('Erro ao criar o agendamento', err)
        return res.status(500).json({ message: 'Erro ao criar o agendamento' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const agendamento = await Agendamento.findByPk(id)
        if (!valores) {
            return res.status(
                404
            ).json(
                {
                    message:
                        'Agendamento não encontrado'
                }
            )
        }
    }
    catch (err) {
        console.error('Erro ao atualizar o agendamento', err)
        return res.status(
            500
        ).json(
            {
                message: 'Erro ao atualizar o agendamento'
            }
        )
    }
}

const listarAgenda = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            order: [['data', 'ASC']],
            include: [
                {
                    model: Ciclista,
                    as: 'ciclistaAgendamento',
                    attributes: ['codCiclista', 'nome', 'email', 'celular']
                },
                {
                    model: Bicicleta,
                    as: 'bicicletaAgendamento',
                    attributes: ['codBicicleta', 'modelo', 'tipo', 'aro']
                }
            ]
        })

        return res.status(200).json(agendamentos)
    } catch (err) {
        console.error('Erro ao listar agenda:', err)
        return res.status(500).json({ message: 'Erro ao listar agenda!' })
    }
}
module.exports = { cadastrar, atualizar, listarAgenda }