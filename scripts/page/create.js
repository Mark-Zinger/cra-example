const fs = require('fs');
const path = require('path');
const colors = require('colors');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

String.prototype.kebabToCamel = function() {
    return this.replace(/-([a-z0-9])/g, function (g) { return g[1].toUpperCase(); })
};

const pageName = process.argv[2];
const pageTitle = process.argv[3];

// Проверка на пустое имя
if (!pageName) {
    console.log(colors.red('▐  Введите название страницы'));
    return;
}

// Проверка на пустой заголовок
if (!pageTitle) {
    console.log(colors.red('▐  Укажите заголовок страницы'));
    return;
}

// Проверка на пустой pages.json
try {
    JSON.parse(fs.readFileSync('./scripts/pages.json').toString());
} catch {
    console.log(colors.red(`▐  Файл ${colors.bold('pages.json')} полностью пуст, добавьте хотя бы один компонент (вручную)`));
    return;
}

const pagesList = JSON.parse(fs.readFileSync('./scripts/pages.json').toString());

// Проверка на существующую страницу
if (pagesList.find(page => page.page === pageName)) {
    console.log(colors.red(`▐  Страница ${colors.bold(pageName)} уже существует`));
    return;
}

// Добавление объекта в JSON
const pageJSON = {
    page: pageName
};

pagesList.push(pageJSON);
fs.writeFileSync('./scripts/pages.json', JSON.stringify(pagesList, null, 2));

// Создание папок и файлов
const pagePath = `./src/pages/${ pageName }`;
fs.mkdirSync(pagePath);

const pageConstName = pageName.kebabToCamel().capitalize();
const pageTemplate = fs.readFileSync('./scripts/page/template.jstpl').toString();
fs.writeFileSync(`${ pagePath }/index.js`, eval('`' + pageTemplate + '`'));
fs.writeFileSync(`${ pagePath }/${ pageName }.scss`, `.${ pageName } {\n    \n}`);

console.log(colors.blue(`▐  Страница ${colors.bold(pageName)} создана`));
