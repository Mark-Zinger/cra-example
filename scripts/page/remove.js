const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const colors = require('colors');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

String.prototype.kebabToCamel = function() {
    return this.replace(/-([a-z0-9])/g, function (g) { return g[1].toUpperCase(); })
};

const pageName = process.argv[2];

// Проверка на пустое имя
if (!pageName) {
    console.log(colors.red('▐  Введите название страницы'));
    return;
}

// Проверка на пустой pages.json
try {
    JSON.parse(fs.readFileSync('./scripts/pages.json').toString());
} catch {
    console.log(colors.red(`▐  Файл ${colors.bold('pages.json')} полностью пуст`));
    return;
}

const pagesList = JSON.parse(fs.readFileSync('./scripts/pages.json').toString());

// Проверка на не существующий компонент
if (!pagesList.find(page => page.page === pageName)) {
    console.log(colors.red(`▐  Страница ${colors.bold(pageName)} не существует`));
    return;
}

const pagePath = `./src/pages/${ pageName }`;
rimraf.sync(pagePath);

const findPage = pagesList.filter(page => page.page !== pageName);
fs.writeFileSync('./scripts/pages.json', JSON.stringify(findPage, null, 2));

let pageScss = fs.readFileSync('./src/assets/scss/pages.scss').toString();
pageScss = pageScss.replace(`@import './src/pages/${ pageName }/${ pageName }';\n`, '');
fs.writeFileSync('./src/assets/scss/pages.scss', pageScss);

console.log(colors.blue(`▐  Страница ${colors.bold(pageName)} удалена`));
