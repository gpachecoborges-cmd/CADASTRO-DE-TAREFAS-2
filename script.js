const botao = document.querySelector(".caixa-entrada button");
const temaEscuro = document.querySelector(".cabecalho-aplicacao button"); 
const campoTarefa = document.getElementById("campo-tarefa");
const lista = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador-tarefas");

let tarefas = [];
let totalTarefas = 0;

function adicionarTarefas(){
    const texto = campoTarefa.value;

    if (texto === ""){
        alert("Digite uma tarefa primeiro!");
        return;
    }

    const novaLi = document.createElement('li');
    novaLi.className = "item-tarefa";

    // Define o HTML apenas UMA vez com a estrutura nova
    novaLi.innerHTML = `
        <div class="conteudo-tarefa">
            <span class="icone-check"><i class="fa-regular fa-circle"></i></span>
            <span class="texto-tarefa">${texto}</span>
        </div>
        <button class="botao-acao excluir">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    
    // --- MARCAR COMO CONCLUÍDA (Com o ícone do "V") ---
    const conteudoTarefa = novaLi.querySelector(".conteudo-tarefa");
    conteudoTarefa.addEventListener("click", function() {
        novaLi.classList.toggle("concluida");
        
        // Colocamos o código do ícone DENTRO do clique para ele mudar na hora certa!
        const iconeCheck = novaLi.querySelector(".icone-check i");
        if (novaLi.classList.contains("concluida")) {
            iconeCheck.className = "fa-solid fa-circle-check";
        } else {
            iconeCheck.className = "fa-regular fa-circle";
        }
    });
        
    // --- EXCLUIR TAREFA (O contador diminuindo fica aqui dentro!) ---
    const botaoApagar = novaLi.querySelector(".excluir");
    botaoApagar.addEventListener("click", function() {
        novaLi.remove();
        
        // Diminui o contador APENAS quando o botão apagar for clicado
        if (totalTarefas > 0) {
            totalTarefas = totalTarefas - 1;
        }
        contador.textContent = `${totalTarefas} tarefas na lista`;
    }); 

    // Adiciona o item pronto na lista do HTML
    lista.appendChild(novaLi);

    // --- ATUALIZAR CONTADOR AO ADICIONAR ---
    totalTarefas = totalTarefas + 1;
    contador.textContent = `${totalTarefas} tarefas na lista`;

    // Limpa o campo de entrada
    campoTarefa.value = "";
}

// Ativa o botão de adicionar tarefa
botao.addEventListener("click", adicionarTarefas);

//modo escuro
temaEscuro.addEventListener("click", function() {
    document.body.classList.toggle("modo-escuro");
    
    const icone = temaEscuro.querySelector("i");
    if (document.body.classList.contains("modo-escuro")) {
        icone.className = "fa-solid fa-sun";
    } else {
        icone.className = "fa-solid fa-moon";
    }
});


