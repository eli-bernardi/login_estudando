const conn = require('./db/conn')
const { Ciclista, Bicicleta, Agendamento } = require('./models/rel')

async function syncDataBase() {
    try {
        await conn.sync({ force: true })
        console.log('Tabelas sincronizadas com sucesso!')
    } catch (error) {
        console.error('Erro ao sincronizar as tabelas:', err)
    } finally {
        await conn.close()
        console.log('Fechando conexão com o banco!')
    }
}

syncDataBase()