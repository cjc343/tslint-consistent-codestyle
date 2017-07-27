"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Lint = require("tslint");
var utils = require("tsutils");
var utils_1 = require("../src/utils");
var walker_1 = require("../src/walker");
var FAIL_MESSAGE = "don't return explicit undefined";
var ALLOW_VOID_EXPRESSION_OPTION = 'allow-void-expression';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ReturnWalker(sourceFile, this.ruleName, {
            allowVoid: this.ruleArguments.indexOf(ALLOW_VOID_EXPRESSION_OPTION) !== -1,
        }));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReturnWalker = (function (_super) {
    tslib_1.__extends(ReturnWalker, _super);
    function ReturnWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReturnWalker.prototype._checkReturnStatement = function (node) {
        if (node.expression !== undefined && this._isUndefined(node.expression))
            this.addFailureAtNode(node.expression, FAIL_MESSAGE);
    };
    ReturnWalker.prototype._isUndefined = function (expression) {
        return this.options.allowVoid ? isUndefinedNotVoidExpr(expression) : utils_1.isUndefined(expression);
    };
    return ReturnWalker;
}(walker_1.AbstractReturnStatementWalker));
function isUndefinedNotVoidExpr(expression) {
    if (utils.isIdentifier(expression) && expression.text === 'undefined')
        return true;
    return utils.isVoidExpression(expression) && utils.isLiteralExpression(expression.expression);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9SZXR1cm5VbmRlZmluZWRSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9SZXR1cm5VbmRlZmluZWRSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZCQUErQjtBQUMvQiwrQkFBaUM7QUFFakMsc0NBQXlDO0FBQ3pDLHdDQUE0RDtBQUU1RCxJQUFNLFlBQVksR0FBRyxpQ0FBaUMsQ0FBQztBQUN2RCxJQUFNLDRCQUE0QixHQUFHLHVCQUF1QixDQUFDO0FBTTdEO0lBQTBCLGdDQUF1QjtJQUFqRDs7SUFNQSxDQUFDO0lBTFUsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3BFLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3RSxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQU5ELENBQTBCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQU1oRDtBQU5ZLG9CQUFJO0FBUWpCO0lBQTJCLHdDQUF1QztJQUFsRTs7SUFTQSxDQUFDO0lBUmEsNENBQXFCLEdBQS9CLFVBQWdDLElBQXdCO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyxtQ0FBWSxHQUFwQixVQUFxQixVQUF5QjtRQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLENBQUMsVUFBVSxDQUFDLEdBQUcsbUJBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBVEQsQ0FBMkIsc0NBQTZCLEdBU3ZEO0FBRUQsZ0NBQWdDLFVBQXlCO0lBQ3JELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxXQUFXLENBQUM7UUFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEcsQ0FBQyJ9