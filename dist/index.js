"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var template_1 = require("./template");
exports.Template = template_1.Template;
var parameter_1 = require("./elements/parameter");
exports.Parameter = parameter_1.Parameter;
var description_1 = require("./elements/description");
exports.Description = description_1.Description;
var output_1 = require("./elements/output");
exports.Output = output_1.Output;
var actions_1 = require("./actions");
exports.add = actions_1.add;
exports.remove = actions_1.remove;
exports.json = actions_1.json;
exports.wipe = actions_1.wipe;
var intrinsic_1 = require("./intrinsic");
exports.Ref = intrinsic_1.Ref;
const service_1 = require("./service");
const fs = require("fs");
const path = require("path");
const files = fs.readdirSync(path.resolve(__dirname, '../stubs/json/resources/'));
files.map(file => {
    const service = file.replace('.json', '');
    exports[service] = service_1.Service(service);
});
