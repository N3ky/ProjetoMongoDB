//1. importar as bibliotecas
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//2. configurar o servidor Express
const app = express();
app.use(cors());//permitir que o front end acesse este back end
app.use(express.json());//permite que o servidor entenda o JSON

//3. conectar ao MongoDB
//!!Subtitua pela sua string de conexão!!
const mongoURI= '';
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true}) 
    .then(() => console.log('Conectando ao MongoDB com sucesso!'))
    .catch(()=> console.error('Erro ao conectar ao MongoDB:', err));

//4. definir o "Schema" - A estrutura dos dados
//que corresponderá à estrutura do seu formulario
const relatorioSchema = new mongoose.Schema({
    titulo: String,
    tipo: String,
    ano: Number,
    status: String,
    data_envio: Date,
    responsavel:{
        nome: String,
        cargo: String,
        departamento: String
    },
    palavra_chave:[String],
    revisoes:[{
        data: Date,
        revisao_por:String,
        comentario:String,
    }]
});

//5. criar o "model" - o objetivo que respresenta sua coleção no banco
const Relatorio = mongoose.Model('Relatorio', relatorioSchema);
//6. criar a "rota" ou "EndPoint" = a url que font ira chamar
app.post('/salvar-relatorio', async(req, res)=>{
    try{
        //pega os dados que o front end enviou (estão em req.boddy)
        const dadosDoFormulario = req.body;

        //cria um novo documento com base nos dados
        const novoRelatorio = new Relatorio(dadosDoFormulario);

        //salvar o documento no bancode dados
        await novoRelatorio.save();

        //envia uma resposta de sucesso de volta para o front
        res.status(201).json({ message:'Relatorio salvo com sucesso!'});
        console.log('Relatorio salvo:', novoRelatorio);
    }
    catch(error){
        //se der erro, enviar mensagem de erro
        res.status(500).json({message: 'Ocorreu um erro ao salvar o relatorio', 
        error: error});
        console.error('Erro ao salvar:', error);
    }
});

const PORT= 3000; //a porta em que o back end ira roda
app.listen(PORT, () =>{
    console.log(`Servidor back-end rodando na porta ${PORT}`);
});