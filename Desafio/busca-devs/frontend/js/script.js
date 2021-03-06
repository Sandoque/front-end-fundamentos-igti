/**
 * Objeto de estado global da aplicação,
 * que será manipulado pelo usuário através dos inputs
 */
const globalState = {
  allPeoples: [],
  filteredPeoples: [],
  loadingData: true,
  currentFilter: '',

  radioAnd: false,
  radioOr: true,

  checkboxes: [
    {
      filter: 'java',
      description: 'Java',
      checked: true,
      image: './img/java.png',
    },
    {
      filter: 'javascript',
      description: 'JavaScript',
      checked: true,
      image: './img/javascript.png',
    },
    {
      filter: 'python',
      description: 'Python',
      checked: true,
      image: './img/python.png',
    },
  ],
};

/**
 * Variáveis globais que mapeiam elementos HTML
 */
const globalDivPeoples = document.querySelector('#divPeoples');
const globalInputName = document.querySelector('#inputName');
const globalDivCheckboxes = document.querySelector('#checkboxes');
const globalRadioAnd = document.querySelector('#radioAnd');
const globalRadioOr = document.querySelector('#radioOr');

/**
 * Tudo começa aqui. A invocação desta função é feita
 * na última linha de código deste arquivo
 */
async function start() {
  /**
   * Adicionando eventos aos inputs, checkboxes e radio buttons
   */
  globalInputName.addEventListener('input', handleInputChange);

  globalRadioAnd.addEventListener('input', handleRadioClick);
  globalRadioOr.addEventListener('input', handleRadioClick);

  /**
   * Renderizando os checkboxes de forma dinâmica
   */
  renderCheckboxes();

  /**
   * Obtendo todos os DEVS do backend
   * de forma assíncrona
   */
  await fetchAll();

  /**
   * Iniciamos o app já filtrando os Devs conforme
   * valor inicial dos inputs
   */
  filteredPeoples();
}

/**
 * Função para montar os checkboxes
 * dinamicamente a partir de globalState
 */
function renderCheckboxes() {
  const { checkboxes } = globalState;

  const inputCheckboxes = checkboxes.map((checkbox) => {
    const { filter: id, description, checked } = checkbox;

    // prettier-ignore
    return (
      `<label class="option">
        <input 
          id="${id}" 
          type="checkbox" 
          checked="${checked}"
        />
        <span>${description}</span>
      </label>`
    );
  });

  globalDivCheckboxes.innerHTML = inputCheckboxes.join('');

  /**
   * Adicionando eventos
   */
  checkboxes.forEach((checkbox) => {
    const { filter: id } = checkbox;
    const element = document.querySelector(`#${id}`);
    element.addEventListener('input', handleCheckboxClick);
  });
}

/**
 * Esta função é executada somente uma vez
 * e traz todos os devs do backend. Além disso,
 * faz uma transformação nos dados, incluindo um
 * campo para facilitar a pesquisa (removendo acentos,
 * espaços em branco e tornando todo o texto minúsculo) e
 * também um array contendo somente as linguagens
 */
async function fetchAll() {
  const url = 'http://localhost:3000/devs';

  const resource = await fetch(url);
  const json = await resource.json();

  const jsonWithImprovedSearch = json.map((item) => {
    const { name, programmingLanguages } = item;

    const lowerCaseName = name.toLocaleLowerCase();

    return {
      ...item,
      searchName: removeAccentMarksFrom(lowerCaseName)
        .split('')
        .filter((char) => char !== ' ')
        .join(''),
      searchLanguages: getOnlyLanguagesFrom(programmingLanguages),
    };
  });

  /**
   * Atribuindo valores aos campos
   * através de cópia
   */
  globalState.allPeoples = [...jsonWithImprovedSearch];
  globalState.filteredPeoples = [...jsonWithImprovedSearch];

  globalState.loadingData = false;
}

function handleInputChange({ target }) {
  /**
   * Atribuindo valor do input ao
   * globalState
   */
  globalState.currentFilter = target.value.toLocaleLowerCase().trim();

  filteredPeoples();
}

/**
 * Lidando com os cliques nos checkboxes
 * de forma dinâmica
 */
function handleCheckboxClick({ target }) {
  const { id, checked } = target;
  const { checkboxes } = globalState;

  /**
   * Refletindo o estado dos checkboxes
   * em globalState
   */
  const checkboxToChange = checkboxes.find(
    (checkbox) => checkbox.filter === id
  );
  checkboxToChange.checked = checked;

  filteredPeoples();
}

/**
 * Aqui garantimos que uma e somente uma das opções
 * de radio de state permaneça como true. Em seguida,
 * filtramos os países
 */
function handleRadioClick({ target }) {
  const radioId = target.id;

  globalState.radioAnd = radioId === 'radioAnd';
  globalState.radioOr = radioId === 'radioOr';

  filteredPeoples();
}

/**
 * Função para varrer o array de linguagens
 * e trazer somente o nome em minúsculas, de forma ordenada
 */
function getOnlyLanguagesFrom(programmingLanguages) {
  return programmingLanguages
    .map((item) => item.language.toLocaleLowerCase())
    .sort();
}

/**
 * Função para remover acentos e caracteres especiais
 * de determinado texto
 */
function removeAccentMarksFrom(text) {
  const WITH_ACCENT_MARKS = 'áãâäàéèêëíìîïóôõöòúùûüñ'.split('');
  const WITHOUT_ACCENT_MARKS = 'aaaaaeeeeiiiiooooouuuun'.split('');

  const newText = text
    .toLocaleLowerCase()
    .split('')
    .map((char) => {
      /**
       * Se indexOf retorna -1, indica
       * que o elemento não foi encontrado
       * no array. Caso contrário, indexOf
       * retorna a posição de determinado
       * caractere no array de busca
       */
      const index = WITH_ACCENT_MARKS.indexOf(char);

      /**
       * Caso o caractere acentuado tenha sido
       * encontrado, substituímos pelo equivalente
       * do array b
       */
      if (index > -1) {
        return WITHOUT_ACCENT_MARKS[index];
      }

      return char;
    })
    .join('');

  return newText;
}

/**
 * Principal função deste app.
 *
 * Filtra os devs conforme definições
 * do usuário e invoca a renderização
 * da tela
 */
function filteredPeoples() {
  const { allPeoples, radioOr, currentFilter, checkboxes } = globalState;

  /**
   * Obtendo array de devs a partir dos
   * checkboxes que estão marcados, retornando somente o id
   * da linguagem para facilitar a busca.
   */
  const filterPeoples = checkboxes
    .filter(({ checked }) => checked)
    .map(({ filter }) => filter)
    .sort();

  /**
   * Obtendo os devss com base nas linguagebss
   * e se o usuário escolheu "OU", o que abrange mais opções do
   * que "E" (mais limitado)
   */
  let filteredPeoples = allPeoples.filter(({ searchLanguages }) => {
    /**
     * Com "OU", verificamos se pelo menos um dos devs
     * escolhidos pelo usuário pertence a determinada linguagem.
     * Ex: Se o usuário escolheu somente java, vai retornar devs
     * que desenvolvem tanto em  java quanto em python, por exemplo
     *
     * Com "E", verificamos a comparação exata da(s) linguagen(s)
     * Ex: Se o usuário escolheu somente java, vai retornar devs
     * que desenvolvemsomente em java
     */
    return radioOr
      ? filterPeoples.some((item) => searchLanguages.includes(item))
      : filterPeoples.join('') === searchLanguages.join('');
  });

  /**
   * Após o primeiro filtro, filtramos mais uma vez
   * conforme o texto do input
   */
  if (currentFilter) {
    filteredPeoples = filteredPeoples.filter(({ searchName }) =>
      searchName.includes(currentFilter)
    );
  }

  /**
   * Definimos os devs filtrados no estado do app
   * e invocamos a função de renderização em seguida.
   */
  globalState.filteredPeoples = filteredPeoples;

  renderPeoples();
}

/**
 * Função de renderização dos devs em tela
 */
function renderPeoples() {
  const { filteredPeoples } = globalState;

  const peoplesToShow = filteredPeoples
    .map((people) => {
      return renderPeople(people);
    })
    .join('');

  const renderedHTML = `
     <div>
       <h2>${filteredPeoples.length} Pessoa(s) encontrada(s)</h2>
       <div class='row'>
         ${peoplesToShow}
       </div>
     </div>
  `;

  globalDivPeoples.innerHTML = renderedHTML;
}

/**
 * Isolamos a função para renderizar um dev,
 * utilizando algumas classes do Materialize
 * e o próprio CSS do app
 */
function renderPeople(people) {
  const { name, picture, searchLanguages } = people;

  return `
    <div class='col s12 m6 l4'>
      <div class='people-card'>
        <img class='flag' src="${picture}" alt="${name}" />
        <div class='data'>
          <span>${name}</span>
          <span class='language'>
            <strong>${renderLanguages(searchLanguages)}</strong>
          </span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Função para renderizar as linguagens.
 */
function renderLanguages(languages) {
  const { checkboxes } = globalState;
  return languages.map((language) => {
    const item = checkboxes.find((item) => item.filter === language);
    return `
      <img class='img-language' src="${item.image}" alt="${item.description}" />
      `;
  });
}

/**
 * Inicializando o app
 */
start();
