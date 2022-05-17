class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        // Percorrer cada um dos atributos dentro da class Despesa
        for(let i in this){  // Recupera os indices de um array ou os atributos de um determinado objeto e coloca dentro de uma variável
            if(this[i] == undefined || this[i] == "" || this[i] == null){
                return false;
            }
        }
        return true;
    }
}

class Bd {

    constructor(){
        let id = localStorage.getItem("id");

        if(id === null){
            localStorage.setItem("id", 0);
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem("id");
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoId()

        // Por usarmos um recurso externo a nossa aplicação, precisamos converter o objeto literal em uma string
        localStorage.setItem(id, JSON.stringify(d)); // Pegando o objeto literal e transformando em notação JSON

        localStorage.setItem("id", id)
    }

    recuperarTodosRegistros(){
        let despesas = []
        let id = localStorage.getItem("id")

        // Recuperando todas as despesas cadastradas no localStorage, por padrão elas vem no formato JSON
        for(let i = 1; i <= id; i++){

            let despesa = JSON.parse(localStorage.getItem(i)) // Mudando as string JSON para objetos literais
            
            // Verificando se alguma despesa é null
            if(despesa === null){
                continue  // Faz com que o laço avance para a repetição seguinte
            }

            despesa.id = i
            despesas.push(despesa) // Passando os objetos literais para um array
        }

        return despesas
    }

    pesquisar(despesa){

        let despesasFiltradas = []
        despesasFiltradas = this.recuperarTodosRegistros()
        
        if(despesa.ano != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano) // d: Recuperando o valor do indice do array
        }

        if(despesa.mes != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if(despesa.dia != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor != ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function cadastrarDespesa(){
    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    let despesa = new Despesa(  // Objeto instânciado
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value,
    )

    if(despesa.validarDados()){
       bd.gravar(despesa)

       // Modal
       document.getElementById("exampleModalLabel").innerHTML = "Registro inserido com sucesso";
       document.getElementById("conteudo").innerHTML = "Despesa foi cadastrada com sucesso!"
       document.getElementById("botao").innerHTML = "Voltar"
       document.getElementById("cor-text").className = "modal-header text-success";
       document.getElementById("botao").className = "btn btn-success";
       $("#modalRegistroDespesa").modal("show");

       // Limpar os campos
       ano.value = "";
       dia.value = "";
       mes.value = "";
       tipo.value = "";
       descricao.value = "";
       valor.value = "";
    }else{
        // Modal
        document.getElementById("exampleModalLabel").innerHTML = "Erro na gravação";
        document.getElementById("conteudo").innerHTML = "Existem campos obrigatórios que não foram preenchidos"
        document.getElementById("botao").innerHTML = "Voltar e corrigir"
        document.getElementById("cor-text").className = "modal-header text-danger";
        document.getElementById("botao").className = "btn btn-danger";
        $("#modalRegistroDespesa").modal("show");
    }

}

function carregaListaDespesa(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros();
    }

    let listaDepesas = document.getElementById("listaDepesas");
    listaDepesas.innerHTML = "";

    despesas.forEach(function(d){   // forEach: Recupera os indice do array e nos permite acessar seus valores

        // Criando a linha (tr)
        let linha = listaDepesas.insertRow();

        // Criar as colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
    
        switch(d.tipo){
            case "1": d.tipo = "Alimentação"
                break
            case "2": d.tipo = "Educação"
                break
            case "3": d.tipo = "Lazer"
                break
            case "4": d.tipo = "Saúde"
                break
            case "5": d.tipo = "Transporte"
                break
        }
        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        // Criando botão de exclusão
        let btn = document.createElement("button")
        btn.className = "btn btn-danger"
        btn.innerHTML = "<i class='fas fa-times'></i>"
        btn.id = "id_despesa_" + d.id;
        btn.onclick = function(){
            let id = this.id.replace("id_despesa_", "")
            bd.remover(id)
            window.location.reload();
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa(){
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa);

    carregaListaDespesa(despesas, true)

}