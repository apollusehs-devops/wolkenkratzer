"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function add(t, e) {
    let result = Object.assign({}, t);
    switch (e.kind) {
        case 'parameter':
            result.Parameters.push(e);
            break;
        default:
            console.log('No match was found');
    }
    return result;
}
exports.add = add;
function json(t) {
    switch (t.kind) {
        case 'parameter':
            let { kind, Name } = t, rest = __rest(t, ["kind", "Name"]);
            return JSON.stringify(rest);
        case 'template':
            let result = {
                Resources: {},
                AWSTemplateFormatVersion: '2010-09-09'
            };
            if (t.Parameters.length > 0) {
                result.Parameters = {};
                t.Parameters.map(p => {
                    result.Parameters[p.Name] = JSON.parse(json(p));
                });
            }
            return JSON.stringify(result, null, 2);
        default:
            console.log('You cant do that!');
            return 'Invalid!';
    }
}
exports.json = json;
