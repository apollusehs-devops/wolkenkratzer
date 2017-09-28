(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Returns an Fn::And object
     * @param {*} one
     * @param {*} two
     */
    function FnAnd(one, two) {
        return { kind: 'FnAnd', FnAnd: [buildIntrinsic(one), buildIntrinsic(two)] };
    }
    exports.FnAnd = FnAnd;
    /**
     * Returns an Fn::Or object
     * @param {*} array
     */
    function FnOr(items) {
        return { kind: 'FnOr', FnOr: items.map(x => buildIntrinsic(x)) };
    }
    exports.FnOr = FnOr;
    /**
     * Returns an Fn::Not object
     * @param {*} array
     */
    function FnNot(items) {
        return { kind: 'FnNot', FnNot: items.map(x => buildIntrinsic(x)) };
    }
    exports.FnNot = FnNot;
    /**
     * Returns an Fn::If object
     * @param {*} array
     */
    function FnIf(items) {
        return { kind: 'FnIf', FnIf: items.map(x => buildIntrinsic(x)) };
    }
    exports.FnIf = FnIf;
    /**
     * Returns a Ref object that references another element in the template
     * @param {*} target
     */
    function Ref(target) {
        if (typeof target === 'string') {
            return { kind: 'Ref', Ref: target };
        }
        else {
            return { kind: 'Ref', Ref: target.Name };
        }
    }
    exports.Ref = Ref;
    /**
     * Returns an Fn::GetAtt object that references another element in the template
     * @param {*} target
     * @param {*} attr
     */
    function FnGetAtt(target, attr) {
        if (typeof target === 'string') {
            return { kind: 'FnGetAtt', FnGetAtt: [target, attr] };
        }
        else {
            return { kind: 'FnGetAtt', FnGetAtt: [target.Name, attr] };
        }
    }
    exports.FnGetAtt = FnGetAtt;
    /**
     * Returns an Fn::Join object
     */
    function FnJoin(delimiter, values) {
        let newValues = values;
        if (Array.isArray(values)) {
            newValues = values.map(v => {
                return buildIntrinsic(v);
            });
        }
        return { kind: 'FnJoin', Delimiter: delimiter, Values: newValues };
    }
    exports.FnJoin = FnJoin;
    /**
     * Returns an Fn::Equals object
     * @param {*} one
     * @param {*} two
     */
    function FnEquals(one, two) {
        return { kind: 'FnEquals', FnEquals: [one, two] };
    }
    exports.FnEquals = FnEquals;
    /**
     * Returns an Fn::Sub object
     * @param {*} input
     */
    function FnSub(input) {
        return { kind: 'FnSub', FnSub: input };
    }
    exports.FnSub = FnSub;
    /**
     * Returns an Fn::Base64 object
     * @param {*} input
     */
    function FnBase64(input) {
        return { kind: 'FnBase64', FnBase64: input };
    }
    exports.FnBase64 = FnBase64;
    /**
     * Returns an Fn::FindInMap object
     * @param {*} mapName
     * @param {*} topLevelKey
     * @param {*} secondLevelKey
     */
    function FnFindInMap(mapName, topLevelKey, secondLevelKey) {
        return {
            FnFindInMap: [mapName, topLevelKey, secondLevelKey],
            kind: 'FnFindInMap'
        };
    }
    exports.FnFindInMap = FnFindInMap;
    /**
     * Returns an Fn::GetAZs object
     * @param {*} region
     */
    function FnGetAZs(region) {
        if (!region) {
            region = Ref('AWS::Region');
        }
        return { kind: 'FnGetAZs', FnGetAZs: region };
    }
    exports.FnGetAZs = FnGetAZs;
    /**
     * Returns an Fn::Select object
     * @param {*} index
     * @param {*} list
     */
    function FnSelect(index, list) {
        if (typeof index === 'string') {
            index = parseInt(index, 10);
        }
        return {
            FnSelect: list,
            index: index,
            kind: 'FnSelect'
        };
    }
    exports.FnSelect = FnSelect;
    function buildIntrinsic(input) {
        if (input['Fn::Equals']) {
            return FnEquals(buildIntrinsic(input['Fn::Equals'][0]), buildIntrinsic(input['Fn::Equals'][1]));
        }
        else if (input.Ref) {
            return Ref(input.Ref);
        }
        else if (input['Fn::GetAtt']) {
            return FnGetAtt(buildIntrinsic(input['Fn::GetAtt'][0]), buildIntrinsic(input['Fn::GetAtt'][1]));
        }
        else if (input['Fn::Or']) {
            return FnOr(input['Fn::Or'].map(x => buildIntrinsic(x)));
        }
        else if (input['Fn::Not']) {
            return FnNot(input['Fn::Not'].map(x => buildIntrinsic(x)));
        }
        else if (input['Fn::If']) {
            return FnIf(input['Fn::If'].map(x => buildIntrinsic(x)));
        }
        else if (input['Fn::And']) {
            return FnAnd(buildIntrinsic(input['Fn::And'][0]), buildIntrinsic(input['Fn::And'][1]));
        }
        else {
            return input;
        }
    }
    exports.buildIntrinsic = buildIntrinsic;
    /**
     * Returns an Fn::ImportValue object
     * @param {*} region
     */
    function FnImportValue(value) {
        return { kind: 'FnImportValue', FnImportValue: value };
    }
    exports.FnImportValue = FnImportValue;
    /**
     * Returns an Fn::Split object
     * @param {*} mapName
     * @param {*} topLevelKey
     * @param {*} secondLevelKey
     */
    function FnSplit(delimiter, value) {
        return {
            delimiter: delimiter,
            kind: 'FnSplit',
            value: value
        };
    }
    exports.FnSplit = FnSplit;
});
//# sourceMappingURL=intrinsic.js.map