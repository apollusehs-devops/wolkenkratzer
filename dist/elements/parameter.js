"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Parameter(name, properties = {}) {
    if (!name || !properties.Type) {
        throw new SyntaxError(`New Parameter with ${JSON.stringify({ name, properties })} parameters is invalid. Name and Type are required.`);
    }
    return { Name: name, Properties: properties };
}
exports.Parameter = Parameter;
