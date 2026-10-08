const botaoAdicionar = document.getElementById("botao-adicionar");
const temaEscuro = document.getElementById("botao-tema");
const campoTarefa = document.getElementById("campo-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const listaHistorico = document.getElementById("lista-historico");
const contador = document.getElementById("contador-tarefas");
const botaoLimparHistorico = document.getElementById("botao-limpar-historico");

// Carrega os dados salvos ou inicia com array vazio
let tarefas = JSON.parse(localStorage.getItem("tarefas_ativas")) || [];
let historico = JSON.parse(localStorage.getItem("tarefas_historico")) || [];

function salvarDados() {
    localStorage.setItem("tarefas_ativas", JSON.stringify(tarefas));
    localStorage.setItem("tarefas_historico", JSON.stringify(historico));
}

function atualizarContador() {
    const total = tarefas.length;
    if (contador) {
        contador.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'} na lista`;
    }
}

function adicionarTarefa() {
    const texto = campoTarefa.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa primeiro!");
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false,
        favorita: false
    };

    tarefas.push(novaTarefa);
    campoTarefa.value = "";
    
    salvarERenderizar();
}

function alternarConcluida(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        salvarERenderizar();
    }
}

function alternarFavorito(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.favorita = !tarefa.favorita;
        salvarERenderizar();
    }
}

function moverParaHistorico(id) {
    const index = tarefas.findIndex(t => t.id === id);
    if (index !== -1) {
        const [removida] = tarefas.splice(index, 1);
        historico.unshift(removida);
        salvarERenderizar();
    }
}

function restaurarTarefa(id) {
    const index = historico.findIndex(t => t.id === id);
    if (index !== -1) {
        const [restaurada] = historico.splice(index, 1);
        tarefas.push(restaurada);
        salvarERenderizar();
    }
}

function excluirDefinitivo(id) {
    historico = historico.filter(t => t.id !== id);
    salvarERenderizar();
}

function limparHistorico() {
    if (historico.length === 0) return;
    if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
        historico = [];
        salvarERenderizar();
    }
}

function renderizar() {
    // Ordena para que as tarefas favoritas fiquem no topo
    tarefas.sort((a, b) => Number(b.favorita) - Number(a.favorita));

    // Renderiza Tarefas Ativas
    listaTarefas.innerHTML = "";
    tarefas.forEach(tarefa => {
        const li = document.createElement("li");
        li.className = `item-tarefa ${tarefa.concluida ? 'concluida' : ''} ${tarefa.favorita ? 'favorita' : ''}`;

        li.innerHTML = `
            <div class="conteudo-tarefa" onclick="alternarConcluida(${tarefa.id})">
                <span class="icone-check">
                    <i class="${tarefa.concluida ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                </span>
                <span class="texto-tarefa">${tarefa.texto}</span>
            </div>
            <div class="acoes-tarefa">
                <button class="botao-acao favoritar" onclick="alternarFavorito(${tarefa.id})" title="Favoritar (Fixar no topo)">
                    <i class="${tarefa.favorita ? 'fa-solid fa-star' : 'fa-regular fa-star'}"></i>
                </button>
                <button class="botao-acao excluir" onclick="moverParaHistorico(${tarefa.id})" title="Mover para histórico">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        listaTarefas.appendChild(li);
    });

    // Renderiza Histórico
    listaHistorico.innerHTML = "";
    if (historico.length === 0) {
        listaHistorico.innerHTML = '<li style="color:var(--cor-concluido); font-size:0.85rem; text-align:center; padding:10px;">Nenhum histórico no momento.</li>';
    } else {
        historico.forEach(tarefa => {
            const li = document.createElement("li");
            li.className = `item-tarefa ${tarefa.concluida ? 'concluida' : ''}`;

            li.innerHTML = `
                <div class="conteudo-tarefa">
                    <span class="icone-check">
                        <i class="${tarefa.concluida ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                    </span>
                    <span class="texto-tarefa">${tarefa.texto}</span>
                </div>
                <div class="acoes-historico">
                    <button class="botao-acao restaurar" onclick="restaurarTarefa(${tarefa.id})" title="Restaurar tarefa">
                        <i class="fa-solid fa-rotate-left"></i>
                    </button>
                    <button class="botao-acao excluir-definitivo" onclick="excluirDefinitivo(${tarefa.id})" title="Excluir permanentemente">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
            listaHistorico.appendChild(li);
        });
    }

    atualizarContador();
}

function salvarERenderizar() {
    salvarDados();
    renderizar();
}

// Persistência do Tema Escuro
function carregarTema() {
    const modoEscuroSalvo = localStorage.getItem("modo_escuro") === "true";
    if (modoEscuroSalvo) {
        document.body.classList.add("modo-escuro");
    }
    atualizarIconeTema();
}

function atualizarIconeTema() {
    const icone = temaEscuro.querySelector("i");
    if (icone) {
        if (document.body.classList.contains("modo-escuro")) {
            icone.className = "fa-solid fa-sun";
        } else {
            icone.className = "fa-solid fa-moon";
        }
    }
}

// Event Listeners
if (botaoAdicionar) botaoAdicionar.addEventListener("click", adicionarTarefa);

if (campoTarefa) {
    campoTarefa.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            adicionarTarefa();
        }
    });
}

if (botaoLimparHistorico) botaoLimparHistorico.addEventListener("click", limparHistorico);

if (temaEscuro) {
    temaEscuro.addEventListener("click", () => {
        document.body.classList.toggle("modo-escuro");
        const estaEscuro = document.body.classList.contains("modo-escuro");
        localStorage.setItem("modo_escuro", estaEscuro);
        atualizarIconeTema();
    });
}

// Carregamento Inicial das informações ao abrir/atualizar a página
carregarTema();
renderizar();
// Seletores do Modal de Novidades
const botaoNovidades = document.getElementById("botao-novidades");
const modalNovidades = document.getElementById("modal-novidades");
const fecharModal = document.getElementById("fechar-modal");
const botaoEntendi = document.getElementById("entendi-novidades");

function abrirNovidades() {
    modalNovidades.classList.add("ativo");
}

function fecharNovidades() {
    modalNovidades.classList.remove("ativo");
}

// Eventos
if (botaoNovidades) botaoNovidades.addEventListener("click", abrirNovidades);
if (fecharModal) fecharModal.addEventListener("click", fecharNovidades);
if (botaoEntendi) botaoEntendi.addEventListener("click", fecharNovidades);

// Fecha o modal ao clicar fora da caixa
window.addEventListener("click", (e) => {
    if (e.target === modalNovidades) {
        fecharNovidades();
    }
});