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
     * Strings constants that map to CloudFormation pseudoparameter
     * Pseudo.AWS_ACCOUNT_ID
     * Pseudo.AWS_NOTIFICATION_ARNS
     * Pseudo.AWS_NO_VALUE
     * Pseudo.AWS_REGION
     * Pseudo.AWS_STACK_ID
     * Pseudo.AWS_STACK_NAME
     */
    exports.Pseudo = {
        AWS_ACCOUNT_ID: 'AWS::AccountId',
        AWS_NOTIFICATION_ARNS: 'AWS::NotificationARNs',
        AWS_NO_VALUE: 'AWS::NoValue',
        AWS_REGION: 'AWS::Region',
        AWS_STACK_ID: 'AWS::StackId',
        AWS_STACK_NAME: 'AWS::StackName'
    };
});
//# sourceMappingURL=pseudo.js.map