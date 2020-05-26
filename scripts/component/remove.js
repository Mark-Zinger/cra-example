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
    console.log(colors.red(`▐  Файл ${colors.bold('components.json')} полностью пуст`));
    return;
}

const componentsList = JSON.parse(fs.readFileSync('./scripts/components.json').toString());

// Проверка на не существующий компонент
if (!componentsList.find(component => component.component === componentName)) {
    console.log(colors.red(`▐  Компонент ${colors.bold(componentName)} не существует`));
    return;
}

const componentPath = `./src/components/${ componentName }`;
const findComponent = componentsList.filter(component => component.component !== componentName);
fs.writeFileSync('./scripts/components.json', JSON.stringify(findComponent, null, 2));
rimraf.sync(componentPath);


console.log(colors.blue(`▐  Компонент ${colors.bold(componentName)} удален`));
