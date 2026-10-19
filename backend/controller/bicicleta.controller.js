const Bicicleta = require('../models/Bicicleta')
                                                    const Ciclista = require('../models/Ciclista')

                                    const cadastrar = async (req, res) => {
    const valores = req.body
    console.log(valores)

    if(
        !valores.modelo ||
            !valores.tipo ||
                !valores.aro||
                    !valores.idCiclista){
                        return res.status(400).json({
                            message:
                            'Todos os dados devem ser inseridos corretamente'
                        })
                    }   
                        try{
                                const ciclista = await Ciclista.findByPk(
                                                                    valores.idCiclista
                                                               )        
                                                               
                                                               if(
                                                                !ciclista
                                                               )
                                                               {
                                                                return
                                                                res.status(
                                                                    404
                                                                ).JSON({
                                                                    message:
                                                                    'Ciclista não encontrado'
                                                                })
                                                               }
                                                                    const novaBicicleta = await Bicicleta.create(
                                                                        valores
                                                                    )
                                                                    
                                                                        return res.status(400).json({
                                                                        message:
                                                                        'Todos os dados devem ser inseridos corretamente'
                                                                    })
                                                                }catch(
                            err
                        ){
                                                    console.error(
                                                        'Erro ao realizar a operação',
                                                        err
                                                    )

                            return res.status(400).json({
                                message:
                                'Todos os dados devem ser inseridos corretamente'
                            })
                        }
}

                                                                                                                                        module.exports =
                                                                                                                                        { 
                                                                                                                                            cadastrar
                                                                                                                                        }