"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var utils = require("tsutils");
var utils_1 = require("../src/utils");
var walker_1 = require("../src/walker");
var FAIL_MESSAGE = "unnecessary else after return";
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new IfWalker(sourceFile, this.ruleName, undefined));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var IfWalker = (function (_super) {
    tslib_1.__extends(IfWalker, _super);
    function IfWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IfWalker.prototype._checkIfStatement = function (node) {
        if (node.elseStatement !== undefined &&
            !utils_1.isElseIf(node) &&
            isLastStatementReturn(node.thenStatement))
            this.addFailureAtNode(node.getChildAt(5, this.sourceFile), FAIL_MESSAGE);
    };
    return IfWalker;
}(walker_1.AbstractIfStatementWalker));
function isLastStatementReturn(statement) {
    return endsControlFlow(statement) === 2;
}
function endsControlFlow(statement) {
    while (utils.isBlockLike(statement)) {
        if (statement.statements.length === 0)
            return 0;
        statement = statement.statements[statement.statements.length - 1];
    }
    return isDefinitelyReturned(statement);
}
function isDefinitelyReturned(statement) {
    if (statement.kind === ts.SyntaxKind.ReturnStatement)
        return 2;
    if (statement.kind === ts.SyntaxKind.BreakStatement)
        return 1;
    if (utils.isIfStatement(statement)) {
        if (statement.elseStatement === undefined)
            return 0;
        var then = endsControlFlow(statement.thenStatement);
        if (!then)
            return then;
        return Math.min(then, endsControlFlow(statement.elseStatement));
    }
    if (utils.isSwitchStatement(statement)) {
        var hasDefault = false;
        var fallthrough = false;
        for (var _i = 0, _a = statement.caseBlock.clauses; _i < _a.length; _i++) {
            var clause = _a[_i];
            var retVal = endsControlFlow(clause);
            if (retVal === 0) {
                fallthrough = true;
            }
            else if (retVal === 1) {
                return 0;
            }
            else {
                fallthrough = false;
            }
            hasDefault = hasDefault || clause.kind === ts.SyntaxKind.DefaultClause;
        }
        return !fallthrough && hasDefault ? 2 : 0;
    }
    return 0;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9FbHNlQWZ0ZXJSZXR1cm5SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9FbHNlQWZ0ZXJSZXR1cm5SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFpQztBQUNqQyw2QkFBK0I7QUFDL0IsK0JBQWlDO0FBRWpDLHNDQUF3QztBQUN4Qyx3Q0FBMEQ7QUFFMUQsSUFBTSxZQUFZLEdBQUcsK0JBQStCLENBQUM7QUFVckQ7SUFBMEIsZ0NBQXVCO0lBQWpEOztJQUlBLENBQUM7SUFIVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFKRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksR0FJaEQ7QUFKWSxvQkFBSTtBQU1qQjtJQUF1QixvQ0FBK0I7SUFBdEQ7O0lBT0EsQ0FBQztJQU5hLG9DQUFpQixHQUEzQixVQUE0QixJQUFvQjtRQUM1QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVM7WUFDaEMsQ0FBQyxnQkFBUSxDQUFDLElBQUksQ0FBQztZQUNmLHFCQUFxQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFDTCxlQUFDO0FBQUQsQ0FBQyxBQVBELENBQXVCLGtDQUF5QixHQU8vQztBQUVELCtCQUErQixTQUF5RDtJQUNwRixNQUFNLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUF5QixDQUFDO0FBQy9ELENBQUM7QUFFRCx5QkFBeUIs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