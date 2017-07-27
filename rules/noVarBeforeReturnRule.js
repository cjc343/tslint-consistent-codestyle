"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var utils_1 = require("../src/utils");
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var variables;
    return ts.forEachChild(ctx.sourceFile, cbNode, cbNodeArray);
    function isUnused(node) {
        if (variables === undefined)
            variables = tsutils_1.collectVariableUsage(ctx.sourceFile);
        return variables.get(node).uses.length === 1;
    }
    function cbNode(node) {
        return ts.forEachChild(node, cbNode, cbNodeArray);
    }
    function cbNodeArray(nodes) {
        if (nodes.length === 0)
            return;
        ts.forEachChild(nodes[0], cbNode, cbNodeArray);
        for (var i = 1; i < nodes.length; ++i) {
            var node = nodes[i];
            if (tsutils_1.isReturnStatement(node)) {
                if (node.expression === undefined)
                    continue;
                if (!tsutils_1.isIdentifier(node.expression)) {
                    ts.forEachChild(node.expression, cbNode, cbNodeArray);
                    continue;
                }
                var previous = nodes[i - 1];
                if (tsutils_1.isVariableStatement(previous) && declaresVariable(previous, node.expression.text, isUnused))
                    ctx.addFailureAtNode(node.expression, "don't declare variable " + node.expression.text + " to return it immediately");
            }
            else {
                ts.forEachChild(node, cbNode, cbNodeArray);
            }
        }
    }
}
function declaresVariable(statement, name, isUnused) {
    var declarations = statement.declarationList.declarations;
    var lastDeclaration = declarations[declarations.length - 1].name;
    if (lastDeclaration.kind === ts.SyntaxKind.Identifier)
        return lastDeclaration.text === name && isUnused(lastDeclaration);
    return isSimpleDestructuringForName(lastDeclaration, name, isUnused);
}
function isSimpleDestructuringForName(pattern, name, isUnused) {
    var identifiersSeen = new Set();
    var inArray = 0;
    var dependsOnVar = 0;
    return recur(pattern) === true;
    function recur(p) {
        if (p.kind === ts.SyntaxKind.ArrayBindingPattern) {
            ++inArray;
            for (var _i = 0, _a = p.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element.kind !== ts.SyntaxKind.OmittedExpression) {
                    var result = handleBindingElement(element);
                    if (result !== undefined)
                        return result;
                }
            }
            --inArray;
        }
        else {
            for (var _b = 0, _c = p.elements; _b < _c.length; _b++) {
                var element = _c[_b];
                var result = handleBindingElement(element);
                if (result !== undefined)
                    return result;
            }
        }
    }
    function handleBindingElement(element) {
        if (element.name.kind !== ts.SyntaxKind.Identifier) {
            if (dependsOnPrevious(element)) {
                ++dependsOnVar;
                var result = recur(element.name);
                --dependsOnVar;
                return result;
            }
            return recur(element.name);
        }
        if (element.name.text !== name)
            return void identifiersSeen.add(element.name.text);
        if (dependsOnVar !== 0)
            return false;
        if (element.dotDotDotToken) {
            if (element.parent.elements.length > 1 ||
                inArray > (element.parent.kind === ts.SyntaxKind.ArrayBindingPattern ? 1 : 0))
                return false;
        }
        else if (inArray !== 0) {
            return false;
        }
        if (element.initializer !== undefined && !utils_1.isUndefined(element.initializer))
            return false;
        return !dependsOnPrevious(element) && isUnused(element.name);
    }
    function dependsOnPrevious(element) {
        if (element.propertyName === undefined || element.propertyName.kind !== ts.SyntaxKind.ComputedPropertyName)
            return false;
        if (tsutils_1.isIdentifier(element.propertyName.expression))
            return identifiersSeen.has(element.propertyName.expression.text);
        if (tsutils_1.isLiteralExpression(element.propertyName.expression))
            return false;
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9WYXJCZWZvcmVSZXR1cm5SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9WYXJCZWZvcmVSZXR1cm5SdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFpQztBQUNqQyw2QkFBK0I7QUFDL0IsbUNBQXVJO0FBRXZJLHNDQUEyQztBQUUzQztJQUEwQixnQ0FBdUI7SUFBakQ7O0lBSUEsQ0FBQztJQUhVLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFKRCxDQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksR0FJaEQ7QUFKWSxvQkFBSTtBQU1qQixjQUFjLEdBQTJCO0lBQ3JDLElBQUksU0FBdUQsQ0FBQztJQUM1RCxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU1RCxrQkFBa0IsSUFBbUI7UUFDakMsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQztZQUN4QixTQUFTLEdBQUcsOEJBQW9CLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxnQkFBZ0IsSUFBYTtRQUN6QixNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxxQkFBcUIsS0FBZ0I7UUFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDO1FB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