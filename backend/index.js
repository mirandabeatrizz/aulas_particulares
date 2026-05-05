import Express from 'express';
import banco from './config/database.js';
import agendamento from './controllers/AgendamentoController.js';
import aula from './controllers/AulaController.js';
import pessoa from './controllers/PessoaController.js';
import tipo_aula from './controllers/TipoAulaController.js';

const api = Express();
api.use(Express.json()); // Permite que a API entenda os JSONs do Insomnia

api.post('/tipo_aula', tipo_aula.criar);
api.put('/tipo_aula/:id',tipo_aula.editar);
api.delete('/tipo_aula/:id', tipo_aula.excluir);
api.get('/tipo_aula', tipo_aula.list);

// ROTAS DE AULA
api.get('/aula', aula.listar);
api.post('/aula', aula.criar);
api.put('/aula/:id', aula.editar);
api.get('/aula/:id', aula.buscar)
api.delete('/aula/:id', aula.excluir)

// ROTAS DE AGENDAMENTO
api.get('/agendamento', agendamento.listar);
api.get('/agendamento/:id', agendamento.buscar);
api.put('/agendamento/:id', agendamento.editar);
api.post('/agendamento', agendamento.criar);
api.delete('/agendamento/:id', agendamento.deletar);

//ROTAS ALUNO E PROFESSOR 
api.post('/pessoa', pessoa.criarPessoa);
api.put('/pessoa/:id', pessoa.editarPessoa);
api.get('/pessoa', pessoa.listarPessoas);
api.delete('/pessoa/:id', pessoa.deletar);
api.delete('/professor/:id', pessoa.deletarProfessor);
api.get('/pessoa/:id', pessoa.buscarPessoa);
api.get('/pessoa/:cpf', pessoa.buscarPorCpf);

// Liga o servidor
api.listen(3000, () => {
    console.log('Api rodando na porta 3000...');
});

try {
    await banco.authenticate();
    console.log('Banco conectado com sucesso.');
} catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
}
