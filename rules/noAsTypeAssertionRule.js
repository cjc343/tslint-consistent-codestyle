"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var utils = require("tsutils");
var FAIL_MESSAGE = 'use <Type> instead of `as Type`';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AsExpressionWalker(sourceFile, this.ruleName, undefined));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var AsExpressionWalker = (function (_super) {
    tslib_1.__extends(AsExpressionWalker, _super);
    function AsExpressionWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsExpressionWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (node.kind === ts.SyntaxKind.AsExpression)
                _this._reportError(node);
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    AsExpressionWalker.prototype._reportError = function (node) {
        this.addFailure(node.type.pos - 2, node.end, FAIL_MESSAGE, [
            Lint.Replacement.appendText(getInsertionPosition(node, this.sourceFile), "<" + node.type.getText(this.sourceFile) + ">"),
            Lint.Replacement.deleteFromTo(node.expression.end, node.end),
        ]);
    };
    return AsExpressionWalker;
}(Lint.AbstractWalker));
exports.AsExpressionWalker = AsExpressionWalker;
function getInsertionPosition(node, sourceFile) {
    var expression = node.expression;
    while (utils.isAssertionExpression(expression))
        expression = expression.expression;
    return expression.getStart(sourceFile);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9Bc1R5cGVBc3NlcnRpb25SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9Bc1R5cGVBc3NlcnRpb25SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFpQztBQUNqQyw2QkFBK0I7QUFDL0IsK0JBQWlDO0FBRWpDLElBQU0sWUFBWSxHQUFHLGlDQUFpQyxDQUFDO0FBRXZEO0lBQTBCLGdDQUF1QjtJQUFqRDs7SUFJQSxDQUFDO0lBSFUsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFKRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksR0FJaEQ7QUFKWSxvQkFBSTtBQU1qQjtJQUF3Qyw4Q0FBeUI7SUFBakU7O0lBaUJBLENBQUM7SUFoQlUsaUNBQUksR0FBWCxVQUFZLFVBQXlCO1FBQXJDLGlCQU9DO1FBTkcsSUFBTSxFQUFFLEdBQUcsVUFBQyxJQUFhO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3pDLEtBQUksQ0FBQyxZQUFZLENBQWtCLElBQUksQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVPLHlDQUFZLEdBQXBCLFVBQXFCLElBQXFCO1FBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFO1lBQ3ZELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQUcsQ0FBQztZQUNuSCxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQy9ELENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTCx5QkFBQztBQUFELENBQUMsQUFqQkQsQ0FBd0MsSUFBSSxDQUFDLGNBQWMsR0FpQjFEO0FBakJZLGdEQUFrQjtBQW1CL0IsOEJBQThCLElBQXFCLEVBQUUsVUFBeUI7SUFDdEUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUNqQyxPQUFPLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUM7UUFDMUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7SUFDdkMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDL0MsQ0FBQyJ9