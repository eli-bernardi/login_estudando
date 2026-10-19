const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const host = 'localhost'

const conn = require('./db/conn')

require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')

const authController = require('./controller/auth.controller')
const agendamentoController = require('./controller/agendamento.controller')
const bicicletaController = require('./controller/bicicleta.controller')
const ciclistaController = require('./controller/ciclista.controller')

//Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.post('/login', authController.login)
app.post('/ciclista', ciclistaController.cadastrar)

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Servidor funcionando' })
})

app.use(authMiddleware)

app.get('/ciclistas', ciclistaController.listar)
app.get('/ciclista/consultarNome/nome', ciclistaController.consultarNome)
app.get('/ciclista/:id', ciclistaController.consultar)
app.put('/ciclista/:id', ciclistaController.atualizar)
app.delete('/ciclista/:id', ciclistaController.apagar)

app.get('/bicicleta', bicicletaController.cadastrar)

app.get('/agendamento', agendamentoController.cadastrar)
app.put('/agendamento:/', agendamentoController.atualizar)
app.get('/agendamento:/', agendamentoController.listarAgenda)


conn.sync()
.then()
.then(()=>{
    app.listen(PORT,host,()=>{
        console.log(`Servidor rodando em http://${host}:${PORT}`)
    })
})