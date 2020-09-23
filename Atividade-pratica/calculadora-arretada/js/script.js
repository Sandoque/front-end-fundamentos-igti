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
    description: 'Soma (a + b):',
    calculationFunction: function sum(a, b) {
      return a + b;
    },
    type: 'a_b',
  },

  {
    id: 2,
    description: 'Subtração 1 (a - b):',
    calculationFunction: function subtract(a, b) {
      return a - b;
    },
    type: 'a_b',
  },

  {
    id: 3,
    description: 'Subtração 2 (b - a):',
    calculationFunction: function subtract(b, a) {
      return b - a;
    },
    type: 'b_a',
  },

  {
    id: 4,
    description: 'Multiplicação(a x b):',
    calculationFunction: function multiply(a, b) {
      return formatNumber(a * b);
    },
    type: 'a_b',
  },

  {
    id: 5,
    description: 'Divisão 1 (a / b):',
    calculationFunction: function division(a, b) {
      return getDivisionFrom(a, b);
    },
    type: 'a_b',
  },

  {
    id: 6,
    description: 'Divisão 2 (b / a):',
    calculationFunction: function division(b, a) {
      return getDivisionFrom(b, a);
    },
    type: 'b_a',
  },

  {
    id: 7,
    description: 'Quadrado de a(a 2):',
    calculationFunction: function square(a) {
      return formatNumber(a ** 2);
    },
    type: 'a',
  },

  {
    id: 8,
    description: 'Quadrado de b (b 2):',
    calculationFunction: function square(b) {
      return formatNumber(b ** 2);
    },
    type: 'b',
  },

  {
    id: 9,
    description: 'Divisores inteiros de a:',
    calculationFunction: function divisorsFrom(a) {
      return getDivisorsFrom(a);
    },
    type: 'a',
  },

  {
    id: 10,
    description: 'Divisores inteiros de b:',
    calculationFunction: function divisorsFrom(b) {
      return getDivisorsFrom(b);
    },
    type: 'b',
  },

  {
    id: 11,
    description: 'Fatorial de a (a!):',
    calculationFunction: function factorial(a) {
      return getFactorialFrom(a);
    },
    type: 'a',
  },

  {
    id: 12,
    description: 'Fatorial de b (b!):',
    calculationFunction: function factorial(b) {
      return getFactorialFrom(b);
    },
    type: 'b',
  },
];

/**
 * Mapeamento dos inputs de interação com o usuário,
 * que estão em index.html.
 */
var globalInputA = document.querySelector('#inputA');
var globalInputB = document.querySelector('#inputB');

/**
 * Tudo começa aqui. A execução desta função
 * está no final deste arquivo.
 */
function start() {
  /**
   * Adicionando evento para "escutar" a mudança
   * de valores nos inputs
   */
  globalInputA.addEventListener('input', handleChangeInputA);
  globalInputB.addEventListener('input', handleChangeInputB);

  /**
   * Efetuando o cálculo inicial
   */
  calculate();
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
   */
  var a = parseInt(globalInputA.value, 10);
  var b = parseInt(globalInputB.value, 10);

  /**
   * Obtendo a div onde serão exibidos
   * todos os cálculos
   */
  var divCalculations = document.querySelector('#calculations');

  /**
   * Criando div interna que será
   * preenchida dinamicamente
   */
  var innerCalculations = document.createElement('div');
  innerCalculations.classList.add('row');

  /**
   * Adicionando class "row" que faz
   * parte do modelo de grid do Materialize
   * https://materializecss.com/grid.html
   */
  innerCalculations.classList.add('row');

  /**
   * Geração dinâmica dos cálculos
   */
  for (var i = 0; i < globalCalculations.length; i++) {
    /**
     * Apelidando cálculo atual em currentCalculation
     */
    var currentCalculation = globalCalculations[i];
    var type = currentCalculation.type;
    var calculationFunction = currentCalculation.calculationFunction;

    /**
     * Montando id único
     */
    var id = 'input_' + currentCalculation.id;

    /**
     * Calculando o valor conforme a função
     * calculate e type
     */
    var value = getCalculationFrom(type, calculationFunction, a, b);

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
  divCalculations.innerHTML = '';
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
function getDivisionFrom(number1, number2) {
  if (number2 === 0) {
    return 'Divisão por zero';
  }
  return formatNumber((number1 / number2).toFixed(2));
}

function formatNumber(number) {
  return new Intl.NumberFormat('pt-BR').format(number);
}

function getDivisorsFrom(number) {
  var divisors = [];

  for (var i = 1; i <= number; i++) {
    if (number % i === 0) {
      divisors.push(i);
    }
  }

  return divisors.join(', ') + ' (' + divisors.length + ')';
}

function getFactorialFrom(number) {
  if (number > 21) {
    return 'Número muito grande';
  }

  var factorial = 1;
  for (var i = number; i > 1; i--) {
    factorial *= i;
  }

  return formatNumber(factorial);
}

function getMaterializeDiv() {
  var div = document.createElement('div');
  div.classList.add('input-field', 'col', 's12', 'm6', 'l4');

  return div;
}

/**
 * Obtendo um novo input somente-leitura, com
 * id e value passados por parâmetro
 */
function getMaterializeInput(id, value) {
  var input = document.createElement('input');
  input.readOnly = true;
  input.type = 'text';
  input.id = id;
  input.value = value;

  return input;
}

/**
 * Obtendo um novo label, com
 * id e descrição (textContent) passados por parâmetro
 */
function getMaterializeLabel(id, description) {
  var label = document.createElement('label');
  label.for = id;
  label.textContent = description;
  label.classList.add('active');

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
function getCalculationFrom(type, calculationFunction, number1, number2) {
  var value = '';

  switch (type) {
    case 'a':
      value = calculationFunction(number1);
      break;

    case 'b':
      value = calculationFunction(number2);
      break;

    case 'a_b':
      value = calculationFunction(number1, number2);
      break;

    case 'b_a':
      value = calculationFunction(number2, number1);
      break;

    default:
      value = 'Cálculo não identificado.';
  }

  return value;
}

/**
 * Início da execução do app
 */
start();
