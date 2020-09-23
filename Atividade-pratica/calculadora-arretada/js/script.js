/**
 * Variável que contem todas
 * as vogais e possíveis
 * variações com acentos
 */
var globalAllVowels = [
  "a",
  "á",
  "ã",
  "â",
  "à",
  "ä",
  "e",
  "ê",
  "ë",
  "è",
  "é",
  "i",
  "í",
  "ì",
  "ï",
  "î",
  "o",
  "ó",
  "õ",
  "ô",
  "ö",
  "ò",
  "u",
  "ú",
  "û",
  "ü",
  "ù"
];

/**
 * Array de objetos que
 * contem a definição de todos
 * os cálculos do app, que será
 * gerado dinamicamente
 * ("Faça o computador trabalhar para você!").
 *
 * Os atributos são:
 *
 * id - identifica unicamente o objeto
 *
 * description - descrição que será utilizada
 * na tag <label>
 *
 * calculate - função que será executada em
 * momento oportuno
 *
 * type - faz o chaveamento que define a ordem
 * e quais parâmetros serão passados para a função
 * acima.
 * "a_b" indica que a e b serão passados, nesta ordem.
 * "b_a" indica que b e a serão passados, nesta ordem.
 * "a" indica que somente "a" será utilizada.
 * "b" indica que somente "b" será utilizada.
 */
var globalCalculations = [
  {
    id: 1,
    description: "Nome completo (BR):",
    calculate: function fullName(a, b) {
      return getFullName(a, b);
    },
    type: "a_b"
  },

  {
    id: 2,
    description: "Nome completo (USA):",
    calculate: function americanFullName(a, b) {
      return b + ", " + a;
    },
    type: "a_b"
  },

  {
    id: 3,
    description: "Nome completo invertido:",
    calculate: function reversedName(a, b) {
      var fullName = getFullName(a, b);
      var reversed = reverse(fullName);
      return reversed;
    },
    type: "a_b"
  },

  {
    id: 4,
    description: "Sobrenome e nome:",
    calculate: function fullNameReversed(a, b) {
      var fullName = getFullName(a, b);
      return fullName;
    },
    type: "b_a"
  },

  {
    id: 5,
    description: "Caracteres de 'Nome':",
    calculate: function countName(a) {
      return a.length;
    },
    type: "a"
  },

  {
    id: 6,
    description: "Caracteres de 'Sobrenome':",
    calculate: function countName(b) {
      return b.length;
    },
    type: "b"
  },

  {
    id: 7,
    description: "Quantidade de vogais:",
    calculate: function countVowels(a, b) {
      var text = getFullNameWithoutSpaces(a, b);

      /**
       * Usando filter para manter somente
       * as vogais do array
       */
      var vowelsCount = text.split("").filter(function onlyVowels(char) {
        return globalAllVowels.includes(char);
      }).length;

      return vowelsCount;
    },
    type: "a_b"
  },

  {
    id: 8,
    description: "Quantidade de consoantes:",
    calculate: function countConsonants(a, b) {
      var text = getFullNameWithoutSpaces(a, b);

      /**
       * Usando filter para manter somente
       * as consoantes do array (!vowels)
       */
      var consonantsCount = text.split("").filter(function onlyVowels(char) {
        return !globalAllVowels.includes(char);
      }).length;

      return consonantsCount;
    },
    type: "a_b"
  }
];

/**
 * Mapeamento dos inputs de interação com o usuário,
 * que estão em index.html.
 */
var globalInputA = document.querySelector("#inputA");
var globalInputB = document.querySelector("#inputB");

/**
 * Tudo começa aqui. A execução desta função
 * está no final deste arquivo.
 */
function start() {
  /**
   * Adicionando evento para "escutar" a mudança
   * de valores nos inputs
   */
  globalInputA.addEventListener("input", handleChangeInputA);
  globalInputB.addEventListener("input", handleChangeInputB);

  /**
   * Efetuando o cálculo inicial
   */
  calculate();
}

/**
 * Função para retornar o nome
 * completo. Foi isolada porque
 * é utilizada em diversos trechos
 * de código
 */
function getFullName(a, b) {
  return a + " " + b;
}

/**
 * Função para inverter as letras
 * de determinado texto, com o apoio
 * da função Array.reverse. Como a entrada
 * é texto (string), devemos convertê-la
 * para array, utilizar o reverse() e em
 * seguida convertê-la novamente para string
 * com a função join.
 */
function reverse(text) {
  return text.split("").reverse().join("");
}

/**
 * Monta o nome completo e retira
 * os espaços em branco com o apoio
 * da função filter
 */
function getFullNameWithoutSpaces(a, b) {
  return getFullName(a, b)
    .split("")
    .filter(function removeSpace(char) {
      return char !== "";
    })
    .join("");
}

/**
 * Função executada após interação
 * com o usuário, que dispara o
 * cálculo
 */
function handleChangeInputA() {
  calculate();
}

/**
 * Função executada após interação
 * com o usuário, que dispara o
 * cálculo
 */
function handleChangeInputB() {
  calculate();
}

/**
 * Principal função do app, que
 * efetua os cálculos e monta
 * a seção "Cálculos" dinamicamente
 */
function calculate() {
  /**
   * Obtendo os valores de a e b
   * a partir dos inputs (nome e sobrenome)
   */
  var a = globalInputA.value;
  var b = globalInputB.value;

  /**
   * Obtendo a div onde serão exibidos
   * todos os cálculos
   */
  var divCalculations = document.querySelector("#calculations");

  /**
   * Criando div interna que será
   * preenchida dinamicamente
   */
  var innerCalculations = document.createElement("div");

  /**
   * Adicionando class "row" que faz
   * parte do modelo de grid do Materialize
   * https://materializecss.com/grid.html
   */
  innerCalculations.classList.add("row");

  /**
   * Geração dinâmica dos cálculos
   */
  for (var i = 0; i < globalCalculations.length; i++) {
    /**
     * Apelidando cálculo atual em currentCalculation
     */
    var currentCalculation = globalCalculations[i];

    /**
     * Montando id único
     */
    var id = "input_" + currentCalculation.id;

    /**
     * Calculando o valor conforme a função
     * calculate e type
     */
    var value = getCalculationFrom(
      currentCalculation.type,
      currentCalculation.calculate,
      a,
      b
    );

    /**
     * Montando os elementos conforme
     * regras do Materialize
     */
    var div = getMaterializeDiv();
    var input = getMaterializeInput(id, value);
    var label = getMaterializeLabel(id, currentCalculation.description);

    div.appendChild(input);
    div.appendChild(label);
    innerCalculations.appendChild(div);
  }

  /**
   * Após o loop, zeramos a div e inserimos
   * innerCalculations como filha.
   */
  divCalculations.innerHTML = "";
  divCalculations.appendChild(innerCalculations);
}

/**
 * Obtendo uma nova div conforme regras do Materialize
 * No sistema de grid do Materialize, a div "mãe" tem a
 * class "row" e todos os filhos tem class "col".
 *
 * 12 é o "número mágico" do sistema de grids do Materialize
 *
 * s12 indica que, em dispositivos pequemos (small), serão
 * exibidos 12/12 => 1 elemento por linha
 *
 * m6 indica que, em dispositivos médios (medium), serão
 * exibidos 12/6 => 2 elementos por linha
 *
 * l4 indica que, em dispositivos grandes (large), serão
 * exibidos 12/4 => 3 elementos por linha
 *
 * Mais detalhes e configurações podem ser vistos em:
 * https://materializecss.com/grid.html
 *
 */
function getMaterializeDiv() {
  var div = document.createElement("div");
  div.classList.add("input-field", "col", "s12", "m6", "l4");

  return div;
}

/**
 * Obtendo um novo input somente-leitura, com
 * id e value passados por parâmetro
 */
function getMaterializeInput(id, value) {
  var input = document.createElement("input");
  input.readOnly = true;
  input.type = "text";
  input.id = id;
  input.value = value;

  return input;
}

/**
 * Obtendo um novo label, com
 * id e descrição (textContent) passados por parâmetro
 */
function getMaterializeLabel(id, description) {
  var label = document.createElement("label");
  label.for = id;
  label.textContent = description;
  label.classList.add("active");

  return label;
}

/**
 * Lógica para identificar qual(is) parâmetro(s)
 * será(ão) utilizado(s) e a respectiva ordem
 *
 * calculationFunction chega como parâmetro e é
 * justamente o atributo "calculate" do objeto "calculations",
 * que é a função a ser executada
 */
function getCalculationFrom(type, calculationFunction, a, b) {
  var value = "";

  switch (type) {
    case "a":
      value = calculationFunction(a);
      break;

    case "b":
      value = calculationFunction(b);
      break;

    case "a_b":
      value = calculationFunction(a, b);
      break;

    case "b_a":
      value = calculationFunction(b, a);
      break;

    default:
      value = "Cálculo não identificado.";
  }

  return value;
}

/**
 * Início da execução do app
 */
start();
