"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var utils_1 = require("../src/utils");
var FAIL_MESSAGE_MISSING = "statement must be braced";
var FAIL_MESSAGE_UNNECESSARY = "unnecessary curly braces";
var OPTION_ELSE = 'else';
var OPTION_CONSISTENT = 'consistent';
var OPTION_BRACED_CHILD = 'braced-child';
var OPTION_NESTED_IF_ELSE = 'nested-if-else';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ExtCurlyWalker(sourceFile, this.ruleName, {
            else: this.ruleArguments.indexOf(OPTION_ELSE) !== -1,
            consistent: this.ruleArguments.indexOf(OPTION_CONSISTENT) !== -1,
            child: this.ruleArguments.indexOf(OPTION_BRACED_CHILD) !== -1,
            nestedIfElse: this.ruleArguments.indexOf(OPTION_NESTED_IF_ELSE) !== -1,
        }));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ExtCurlyWalker = (function (_super) {
    tslib_1.__extends(ExtCurlyWalker, _super);
    function ExtCurlyWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExtCurlyWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (tsutils_1.isIterationStatement(node)) {
                _this._checkLoop(node);
            }
            else if (tsutils_1.isIfStatement(node)) {
                _this._checkIfStatement(node);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    ExtCurlyWalker.prototype._checkLoop = function (node) {
        if (this._needsBraces(node.statement)) {
            if (node.statement.kind !== ts.SyntaxKind.Block)
                this.addFailureAtNode(node.statement, FAIL_MESSAGE_MISSING);
        }
        else if (node.statement.kind === ts.SyntaxKind.Block) {
            this._reportUnnecessary(node.statement);
        }
    };
    ExtCurlyWalker.prototype._checkIfStatement = function (node) {
        var _a = this._ifStatementNeedsBraces(node), then = _a[0], otherwise = _a[1];
        if (then) {
            if (node.thenStatement.kind !== ts.SyntaxKind.Block)
                this.addFailureAtNode(node.thenStatement, FAIL_MESSAGE_MISSING);
        }
        else if (node.thenStatement.kind === ts.SyntaxKind.Block) {
            this._reportUnnecessary(node.thenStatement);
        }
        if (otherwise) {
            if (node.elseStatement !== undefined &&
                node.elseStatement.kind !== ts.SyntaxKind.Block && node.elseStatement.kind !== ts.SyntaxKind.IfStatement)
                this.addFailureAtNode(node.elseStatement, FAIL_MESSAGE_MISSING);
        }
        else if (node.elseStatement !== undefined && node.elseStatement.kind === ts.SyntaxKind.Block) {
            this._reportUnnecessary(node.elseStatement);
        }
    };
    ExtCurlyWalker.prototype._needsBraces = function (node, allowIfElse) {
        if (tsutils_1.isBlock(node))
            return node.statements.length !== 1 || this._needsBraces(node.statements[0], allowIfElse);
        if (!allowIfElse && this.options.nestedIfElse && tsutils_1.isIfStatement(node) && node.elseStatement !== undefined)
            return true;
        if (!this.options.child)
            return false;
        if (tsutils_1.isIfStatement(node)) {
            var result = this._ifStatementNeedsBraces(node);
            return result[0] || result[1];
        }
        if (tsutils_1.isIterationStatement(node))
            return this._needsBraces(node.statement);
        return node.kind === ts.SyntaxKind.SwitchStatement || node.kind === ts.SyntaxKind.TryStatement;
    };
    ExtCurlyWalker.prototype._ifStatementNeedsBraces = function (node, excludeElse) {
        if (this.options.else) {
            if (node.elseStatement !== undefined || utils_1.isElseIf(node))
                return [true, true];
        }
        else if (this.options.consistent) {
            if (this._needsBraces(node.thenStatement) ||
                !excludeElse && node.elseStatement !== undefined &&
                    (tsutils_1.isIfStatement(node.elseStatement)
                        ? this._ifStatementNeedsBraces(node.elseStatement)[0]
                        : this._needsBraces(node.elseStatement, true)))
                return [true, true];
            if (utils_1.isElseIf(node) && this._ifStatementNeedsBraces(node.parent, true)[0])
                return [true, true];
        }
        if (node.elseStatement !== undefined) {
            var statement = unwrapBlock(node.thenStatement);
            return [
                tsutils_1.isIfStatement(statement) && statement.elseStatement === undefined || this._needsBraces(statement),
                !excludeElse && this._needsBraces(node.elseStatement, true),
            ];
        }
        return [this._needsBraces(node.thenStatement), false];
    };
    ExtCurlyWalker.prototype._reportUnnecessary = function (block) {
        var closeBrace = block.getChildAt(2, this.sourceFile);
        var nextTokenStart = tsutils_1.getNextToken(closeBrace, this.sourceFile).getStart(this.sourceFile);
        var closeFix = tsutils_1.isSameLine(this.sourceFile, closeBrace.end, nextTokenStart)
            ? Lint.Replacement.deleteFromTo(closeBrace.end - 1, nextTokenStart)
            : Lint.Replacement.deleteFromTo(block.statements.end, block.end);
        this.addFailure(block.statements.pos - 1, block.end, FAIL_MESSAGE_UNNECESSARY, [
            Lint.Replacement.deleteFromTo(block.pos, block.statements.pos),
            closeFix,
        ]);
    };
    return ExtCurlyWalker;
}(Lint.AbstractWalker));
function unwrapBlock(node) {
    while (tsutils_1.isBlock(node) && node.statements.length === 1)
        node = node.statements[0];
    return node;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0Q3VybHlSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXh0Q3VybHlSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFpQztBQUNqQyw2QkFBK0I7QUFDL0IsbUNBQWlHO0FBQ2pHLHNDQUF3QztBQUV4QyxJQUFNLG9CQUFvQixHQUFHLDBCQUEwQixDQUFDO0FBQ3hELElBQU0sd0JBQXdCLEdBQUcsMEJBQTBCLENBQUM7QUFFNUQsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQzNCLElBQU0saUJBQWlCLEdBQUcsWUFBWSxDQUFDO0FBQ3ZDLElBQU0sbUJBQW1CLEdBQUcsY0FBYyxDQUFDO0FBQzNDLElBQU0scUJBQXFCLEdBQUcsZ0JBQWdCLENBQUM7QUFTL0M7SUFBMEIsZ0NBQXVCO0lBQWpEOztJQVNBLENBQUM7SUFSVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDdEUsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwRCxVQUFVLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEUsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdELFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6RSxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQVRELENBQTBCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQVNoRDtBQVRZLG9CQUFJ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