import express from 'express'
import BancoMongoDB from './infra/banco/banco-mongodb'
import ListaFilme from './aplicacao/lista-filme.use-case'
import SalvarFilme from './aplicacao/salva-filme.use-case'

const bancoMongoDB = new BancoMongoDB()
const app = express()
app.use(express.json())

//Tenho que ter uma rota post para cadastrar um filme
type Filme = {
    id:number,
    titulo:string,
    descricao:string,
    imagem:string
}

let filmesCadastrados:Filme[] = []
app.post('/filmes', async (req,res)=>{
    const {id, titulo, descricao, imagem} = req.body
    const filme = {
        id,
        titulo,
        descricao,
        imagem
    }
    //como salvo o filme
    const salvarFilme = new SalvarFilme(bancoMongoDB)
    const filmes = await salvarFilme.execute(filme)
    res.status(201).send(filmes)
})

app.get('/filmes', async(req,res)=>{
    //usem o listarFilme para listar os filmes
    
    const listaFilme = new ListaFilme(bancoMongoDB)
    const filmes = await listaFilme.executar()
    res.send(filmes)
})

app.get('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const filmeId = filmesCadastrados.find(Filme => Filme.id == id);
    if(!filmeId) return res.status(404).send("Filme não encontrado");
    res.status(200).send(filmeId);      
});

//Tenho que iniciar o servidor na porta 3000
app.listen(3000,()=>{
    console.log('Servidor rodando na porta 3000')
})