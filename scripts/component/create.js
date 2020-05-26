const fs = require('fs');
const path = require('path');
const colors = require('colors');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

String.prototype.kebabToCamel = function() {
    return this.replace(/-([a-z0-9])/g, function (g) { return g[1].toUpperCase(); })
};

const componentName = process.argv[2];

// Проверка на пустое имя
if (!componentName) {
    console.log(colors.red('▐  Введите название компонента'));
    return;
}

// Проверка на пустой components.json
try {
    JSON.parse(fs.readFileSync('./scripts/components.json').toString());
} catch {
    console.log(colors.red(`▐  Файл ${colors.bold('components.json')} полностью пуст, добавьте хотя бы один компонент (вручную)`));
    return;
}

const componentsList = JSON.parse(fs.readFileSync('./scripts/components.json').toString());

// Проверка на существующий компонент
if (componentsList.find(component => component.component === componentName)) {
    console.log(colors.red(`▐  Компонент ${colors.bold(componentName)} уже существует`));
    return;
}

// Добавление объекта в JSON
const componentJSON = {
    component: componentName
};

componentsList.push(componentJSON);
fs.writeFileSync('./scripts/components.json', JSON.stringify(componentsList, null, 2));

// Создание папок и файлов
const componentPath = `./src/components/${ componentName }`;
fs.mkdirSync(componentPath);

const componentConstName = componentName.kebabToCamel().capitalize();
const componentTemplate = fs.readFileSync('./scripts/component/template.jstpl').toString();
fs.writeFileSync(`${ componentPath }/${ componentName }.js`, eval('`' + componentTemplate + '`'));
fs.writeFileSync(`${ componentPath }/${ componentName }.scss`, `.${ componentName } {\n    $root: &;\n}`);

console.log(colors.blue(`▐  Компонент ${colors.bold(componentName)} создан`));
