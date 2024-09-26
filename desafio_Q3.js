/*
 Teste de desenvolvimento para Target Sistemas
 Desenvolvido por Victória Belo em NodeJS
*/

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });     
const separador = '*'.repeat(50);

//gerador de Lista de Faturamento. Não incluso finais de semana/feriados
async function criarLista(){   
    const listaFaturamento = [];
    try {
        for (let i = 0; i < 1000; i++){           
            const dataFaturamento = gerarData(new Date(2024, 0, 31), new Date(2024, 11, 31)).toString();
            listaFaturamento.push({
                id: i+1,
                valor: (Math.random() * 500).toFixed(2),
                dataFaturamento: dataFaturamento  
            });       
        }        
        return listaFaturamento;
    } catch (e) {
        throw new Error(e);
    }   
}

//gerador de datas aleatórias para Lista de Faturamento
function gerarData(inicio, fim){
    const feriadosNacionais = ['2024-01-01', '2024-04-21', '2024-05-01', '2024-09-07', '2024-10-12', '2024-11-02', '2024-11-15', '2024-12-25'];
    let dtFormatada;
    let diaUtil;
    let resultado;

    do {
        const dataInicio = inicio.getTime();
        const dataFim = fim.getTime();
        resultado = new Date(Math.random() * (dataFim - dataInicio) + dataInicio);
        dtFormatada = resultado.toISOString().split('T')[0];
        diaUtil = resultado.getDay();
    } while (feriadosNacionais.includes(dtFormatada) || diaUtil === 0 || diaUtil === 6);     
    return resultado.toISOString().split('T')[0];   
}

//procura por data informada
 function buscarPorData(lista, data){    
    try {       
      return lista.filter((e)=> e.dataFaturamento === data);                                  
    } catch (e) {
        throw new Error(e);
    }
}

//Informa maior e menor valor ocorrido em data informada 
function encontrarMaiorMenor(listaPorData){
    let maior = 0; 
    let menor = 99999;  

    for(let elemento of listaPorData){      
        let valor = parseFloat(elemento.valor);
        if(valor > maior){
            maior = valor;           
        }

        if(valor < menor){
            menor = valor;
        }
    }   
    console.log(`\n MAIOR valor do dia [${listaPorData[0].dataFaturamento}]: ${maior}\n MENOR valor do dia [${listaPorData[0].dataFaturamento}]: ${menor}\n${separador}`);
}

function calcularMediaEAcima(listaFaturamento) {
    let soma = 0;
    let diasComFaturamento = 0; 
    const faturamentoPorData = []; 

    for (let elemento of listaFaturamento) {
        const valor = parseFloat(elemento.valor);
        const data = elemento.dataFaturamento;
       
        if (valor > 0) { 
            soma += valor;
            diasComFaturamento++;
            
            const dataExiste = faturamentoPorData.find(e => e.dataFaturamento === data);
            if (dataExiste) {                
                dataExiste.faturamento += valor;
            } else {
                faturamentoPorData.push({
                    dataFaturamento: data,
                    faturamento: valor
                });
            }
        }
    }    
    const media = (soma/diasComFaturamento).toFixed(2);  
    const diasAcimaDaMedia = faturamentoPorData.filter(e => e.faturamento > media).length;
    console.log(`\n MÉDIA anual: ${media}\n Total de dias com faturamento ACIMA DA MÉDIA: ${diasAcimaDaMedia}\n`);
}

async function iniciar(){    
    try {
        const listaFaturamento = await criarLista();
        console.log(`${separador}\nIniciado\nLISTA CRIADA\n${separador}`);
        rl.question('Informe uma data (YYYY-MM-DD): ', (resposta) => {    
            const dataExiste = listaFaturamento.some((e)=> e.dataFaturamento === resposta);
            if(!dataExiste){
                console.log('Data não encontrada. POr favor, verifique se o formato está correto.');
                rl.close();
                return;
            }
            const listaPorData = buscarPorData(listaFaturamento, resposta); 
            console.log(`${separador}\n [Data Selecionada]: ${resposta} \n Dados encontrados: ${JSON.stringify(listaPorData, null, 2)}`);
            encontrarMaiorMenor(listaPorData);
            calcularMediaEAcima(listaFaturamento);
            rl.close();
        });    
    } catch (error) {
        console.error('Algo deu errado! ', e);
    }    
}

iniciar();