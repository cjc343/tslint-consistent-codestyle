"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tsutils_1 = require("tsutils");
var Lint = require("tslint");
var ts = require("typescript");
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = tslib_1.__assign({ 'max-length': 2 }, this.ruleArguments[0]);
        return this.applyWithFunction(sourceFile, walk, options);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function failureString(exit) {
    return "Remainder of block is inside 'if' statement. Prefer to invert the condition and '" + exit + "' early.";
}
function failureStringSmall(exit, branch) {
    return "'" + branch + "' branch is small; prefer an early '" + exit + "' to a full if-else.";
}
function walk(ctx) {
    var sourceFile = ctx.sourceFile, maxLineLength = ctx.options["max-length"];
    return ts.forEachChild(sourceFile, function cb(node) {
        if (tsutils_1.isIfStatement(node))
            check(node);
        return ts.forEachChild(node, cb);
    });
    function check(node) {
        var exit = getExit(node);
        if (exit === undefined)
            return;
        var thenStatement = node.thenStatement, elseStatement = node.elseStatement;
        var thenSize = size(thenStatement, sourceFile);
        if (elseStatement === undefined) {
            if (isLarge(thenSize))
                fail(failureString(exit));
            return;
        }
        if (elseStatement.kind === ts.SyntaxKind.IfStatement)
            return;
        var elseSize = size(elseStatement, sourceFile);
        if (isSmall(thenSize) && isLarge(elseSize)) {
            fail(failureStringSmall(exit, 'then'));
        }
        else if (isSmall(elseSize) && isLarge(thenSize)) {
            fail(failureStringSmall(exit, 'else'));
        }
        function fail(failure) {
            ctx.addFailureAt(node.getStart(sourceFile), 2, failure);
        }
    }
    function isSmall(length) {
        return length === 1;
    }
    function isLarge(length) {
        return length > maxLineLength;
    }
}
function size(node, sourceFile) {
    return tsutils_1.isBlock(node)
        ? node.statements.length === 0 ? 0 : diff(node.statements[0].getStart(sourceFile), node.statements.end, sourceFile)
        : diff(node.getStart(sourceFile), node.end, sourceFile);
}
function diff(start, end, sourceFile) {
    return ts.getLineAndCharacterOfPosition(sourceFile, end).line
        - ts.getLineAndCharacterOfPosition(sourceFile, start).line
        + 1;
}
function getExit(node) {
    var parent = node.parent;
    if (tsutils_1.isBlock(parent)) {
        var container = parent.parent;
        return tsutils_1.isCaseOrDefaultClause(container) && container.statements.length === 1
            ? getCaseClauseExit(container, parent, node)
            : isLastStatement(node, parent.statements) ? getEarlyExitKind(container) : undefined;
    }
    return tsutils_1.isCaseOrDefaultClause(parent)
        ? getCaseClauseExit(parent, parent, node)
        : getEarlyExitKind(parent);
}
function getCaseClauseExit(clause, _a, node) {
    var statements = _a.statements;
    return statements[statements.length - 1].kind === ts.SyntaxKind.BreakStatement
        ? isLastStatement(node, statements, statements.length - 2) ? 'break' : undefined
        : clause.parent.clauses[clause.parent.clauses.length - 1] === clause && isLastStatement(node, statements) ? 'break' : undefined;
}
function getEarlyExitKind(_a) {
    var kind = _a.kind;
    switch (kind) {
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            return 'return';
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.DoStatement:
            return 'continue';
        default:
            return;
    }
}
function isLastStatement(ifStatement, statements, i) {
    if (i === void 0) { i = statements.length - 1; }
    while (true) {
        var statement = statements[i];
        if (statement === ifStatement)
            return true;
        if (statement.kind !== ts.SyntaxKind.FunctionDeclaration)
            return false;
        if (i === 0)
            throw new Error();
        i--;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWFybHlFeGl0UnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVhcmx5RXhpdFJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXdFO0FBQ3hFLDZCQUErQjtBQUMvQiwrQkFBaUM7QUFFakM7SUFBMEIsZ0NBQXVCO0lBQWpEOztJQUtBLENBQUM7SUFKVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsSUFBTSxPQUFPLHNCQUFLLFlBQVksRUFBRSxDQUFDLElBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1FBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFMRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksR0FLaEQ7QUFMWSxvQkFBSTtBQU9qQix1QkFBdUIsSUFBWTtJQUMvQixNQUFNLENBQUMsc0ZBQW9GLElBQUksYUFBVSxDQUFDO0FBQzlHLENBQUM7QUFFRCw0QkFBNEIsSUFBWSxFQUFFLE1BQXVCO0lBQzdELE1BQU0sQ0FBQyxNQUFJLE1BQU0sNENBQXVDLElBQUkseUJBQXNCLENBQUM7QUFDdkYsQ0FBQztBQU1ELGNBQWMsR0FBK0I7SUFDakMsSUFBQSwyQkFBVSxFQUFhLHlDQUEyQixDQUFXO0lBRXJFLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxZQUFZLElBQUk7UUFDL0MsRUFBRSxDQUFDLENBQUMsdUJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsZUFBZSxJQUFvQjtRQUMvQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQztZQUNuQixNQUFNLENBQUM7UUFFSCxJQUFBLGtDQUFhLEVBQUUsa0NBQWEsQ0FBVTtRQUM5QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWpELEVBQUUsQ0FBQyxDQUFDLGFBQWEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFHRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO1lBQ2pELE1BQU0sQ0FBQztRQUVYLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFakQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFFRCxjQUFjLE9BQWU7WUFDekIsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RCxDQUFDO0lBQ0wsQ0FBQztJQUVELGlCQUFpQixNQUFjO1FBQzNCLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxpQkFBaUIsTUFBYztRQUMzQixNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztJQUNsQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGNBQWMsSUFBYSxFQUFFLFVBQXlCO0lBQ2xELE1BQU0sQ0FBQyxpQkFBTyxDQUFDLElBQUksQ0FBQztVQUNkLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQztVQUNqSCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFFRCxjQUFjLEtBQWEsRUFBRSxHQUFXLEVBQUUsVUFBeUI7SUFDL0QsTUFBTSxDQUFDLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSTtVQUN2RCxFQUFFLENBQUMsNkJBQTZCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUk7VUFDeEQsQ0FBQyxDQUFDO0FBQ1osQ0FBQztBQUVELGlCQUFpQixJQUFvQjtJQUNqQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTyxDQUFDO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFPLENBQUM7UUFDakMsTUFBTSxDQUFDLCtCQUFxQixDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUM7Y0FDdEUsaUJBQWlCLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUM7Y0FFMUMsZUFBZSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQzdGLENBQUM7SUFDRCxNQUFNLENBQUMsK0JBQXFCLENBQUMsTUFBTSxDQUFDO1VBQzlCLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDO1VBRXZDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCwyQkFDSSxNQUE4QixFQUM5QixFQUFpRCxFQUNqRCxJQUFvQjtRQURsQiwwQkFBVTtJQUVaLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjO1VBRXhFLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLFNBQVM7VUFFOUUsTUFBTSxDQUFDLE1BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLE1BQU0sSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDMUksQ0FBQztBQUVELDBCQUEwQixFQUFpQjtRQUFmLGNBQUk7SUFDNUIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNYLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUN2QyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUM7UUFDdEMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUNqQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUM7UUFDckMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztRQUMvQixLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO1FBQy9CLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXO1lBQzFCLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFFcEIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUNsQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQ2xDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7UUFDaEMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUNsQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVztZQUMxQixNQUFNLENBQUMsVUFBVSxDQUFDO1FBRXRCO1lBSUksTUFBTSxDQUFDO0lBQ2YsQ0FBQztBQUNMLENBQUM7QUFFRCx5QkFBeUIsV0FBMkIsRUFBRSxVQUF1QyxFQUFFLENBQWlDO0lBQWpDLGtCQUFBLEVBQUEsSUFBWSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDNUgsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNWLElBQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssV0FBVyxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDO1lBQ3JELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVSLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN0QixDQUFDLEVBQUUsQ0FBQztJQUNSLENBQUM7QUFDTCxDQUFDIn0=