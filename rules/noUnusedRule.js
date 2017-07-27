"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var OPTION_FUNCTION_EXPRESSION_NAME = 'unused-function-expression-name';
var OPTION_CLASS_EXPRESSION_NAME = 'unused-class-expression-name';
var OPTION_IGNORE_PARAMETERS = 'ignore-parameters';
var OPTION_IGNORE_IMPORTS = 'ignore-imports';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UnusedWalker(sourceFile, this.ruleName, {
            functionExpressionName: this.ruleArguments.indexOf(OPTION_FUNCTION_EXPRESSION_NAME) !== -1,
            classExpressionName: this.ruleArguments.indexOf(OPTION_CLASS_EXPRESSION_NAME) !== -1,
            ignoreParameters: this.ruleArguments.indexOf(OPTION_IGNORE_PARAMETERS) !== -1,
            ignoreImports: this.ruleArguments.indexOf(OPTION_IGNORE_IMPORTS) !== -1,
        }));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var UnusedWalker = (function (_super) {
    tslib_1.__extends(UnusedWalker, _super);
    function UnusedWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnusedWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var usage = tsutils_1.collectVariableUsage(sourceFile);
        usage.forEach(function (variable, identifier) {
            if (isExcluded(variable, sourceFile, usage, _this.options))
                return;
            switch (identifier.parent.kind) {
                case ts.SyntaxKind.FunctionExpression:
                    if (variable.uses.length === 0 && _this.options.functionExpressionName)
                        _this._failNamedExpression(identifier, "Function");
                    return;
                case ts.SyntaxKind.ClassExpression:
                    if (variable.uses.length === 0 && _this.options.classExpressionName)
                        _this._failNamedExpression(identifier, "Class");
                    return;
            }
            if (variable.uses.length === 0)
                return _this.addFailureAtNode(identifier, showKind(identifier) + " '" + identifier.text + "' is unused.");
            var uses = filterWriteOnly(variable.uses, identifier);
            if (uses.length === 0)
                return _this.addFailureAtNode(identifier, showKind(identifier) + " '" + identifier.text + "' is only written and never read.");
            var filtered = uses.length !== variable.uses.length;
            uses = filterUsesInDeclaration(uses, variable.declarations);
            if (uses.length === 0)
                return _this.addFailureAtNode(identifier, showKind(identifier) + " '" + identifier.text + "' is only " + (filtered ? 'written or ' : '') + "used inside of its declaration.");
        });
    };
    UnusedWalker.prototype._failNamedExpression = function (identifier, kind) {
        this.addFailureAtNode(identifier, kind + " '" + identifier.text + "' is never used by its name. Convert it to an anonymous " + kind.toLocaleLowerCase() + " expression.", Lint.Replacement.deleteFromTo(identifier.pos, identifier.end));
    };
    return UnusedWalker;
}(Lint.AbstractWalker));
function filterUsesInDeclaration(uses, declarations) {
    var result = [];
    outer: for (var _i = 0, uses_1 = uses; _i < uses_1.length; _i++) {
        var use = uses_1[_i];
        for (var _a = 0, declarations_1 = declarations; _a < declarations_1.length; _a++) {
            var declaration = declarations_1[_a];
            var parent = declaration.parent;
            if (use.location.pos > parent.pos && use.location.pos < parent.end &&
                (parent.kind !== ts.SyntaxKind.VariableDeclaration ||
                    initializerHasNoSideEffect(parent, use.location)))
                continue outer;
        }
        result.push(use);
    }
    return result;
}
function initializerHasNoSideEffect(declaration, use) {
    if (declaration.initializer === undefined)
        return true;
    return (function cb(node) {
        if (node.pos > use.pos)
            return 2;
        if (node.end <= use.pos)
            return;
        switch (node.kind) {
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.NewExpression:
            case ts.SyntaxKind.TaggedTemplateExpression:
                return 1;
            case ts.SyntaxKind.ArrowFunction:
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.ClassExpression:
                return 2;
        }
        return ts.forEachChild(node, cb);
    })(declaration.initializer) !== 1;
}
function filterWriteOnly(uses, identifier) {
    var result = [];
    for (var _i = 0, uses_2 = uses; _i < uses_2.length; _i++) {
        var use = uses_2[_i];
        if (use.domain & (2 | 8) ||
            tsutils_1.isExpressionValueUsed(use.location) && !isUpdate(use.location, identifier))
            result.push(use);
    }
    return result;
}
function isUpdate(use, identifier) {
    while (true) {
        var parent = use.parent;
        switch (parent.kind) {
            case ts.SyntaxKind.ParenthesizedExpression:
            case ts.SyntaxKind.NonNullExpression:
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.AsExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.TypeOfExpression:
            case ts.SyntaxKind.ConditionalExpression:
            case ts.SyntaxKind.SpreadElement:
            case ts.SyntaxKind.SpreadAssignment:
            case ts.SyntaxKind.ObjectLiteralExpression:
            case ts.SyntaxKind.ArrayLiteralExpression:
                use = parent;
                break;
            case ts.SyntaxKind.PropertyAssignment:
            case ts.SyntaxKind.ShorthandPropertyAssignment:
            case ts.SyntaxKind.TemplateSpan:
                use = parent.parent;
                break;
            case ts.SyntaxKind.BinaryExpression:
                if (tsutils_1.isAssignmentKind(parent.operatorToken.kind))
                    return parent.right === use &&
                        parent.left.kind === ts.SyntaxKind.Identifier &&
                        parent.left.text === identifier.text;
                use = parent;
                break;
            default:
                return false;
        }
    }
}
function isExcluded(variable, sourceFile, usage, opts) {
    if (variable.exported || variable.inGlobalScope)
        return true;
    for (var _i = 0, _a = variable.declarations; _i < _a.length; _i++) {
        var declaration = _a[_i];
        var parent = declaration.parent;
        if (declaration.text.startsWith('_')) {
            switch (parent.kind) {
                case ts.SyntaxKind.Parameter:
                    return true;
                case ts.SyntaxKind.VariableDeclaration:
                    if (parent.parent.parent.kind === ts.SyntaxKind.ForInStatement ||
                        parent.parent.parent.kind === ts.SyntaxKind.ForOfStatement)
                        return true;
                    break;
                case ts.SyntaxKind.BindingElement:
                    if (parent.dotDotDotToken !== undefined)
                        break;
                    var pattern = parent.parent;
                    if (pattern.kind === ts.SyntaxKind.ObjectBindingPattern &&
                        pattern.elements[pattern.elements.length - 1].dotDotDotToken !== undefined)
                        return true;
            }
        }
        if (tsutils_1.isParameterDeclaration(parent) &&
            (opts.ignoreParameters || tsutils_1.isParameterProperty(parent) || !tsutils_1.isFunctionWithBody(parent.parent)) ||
            parent.kind === ts.SyntaxKind.VariableDeclaration && parent.parent.kind === ts.SyntaxKind.CatchClause ||
            parent.kind === ts.SyntaxKind.TypeParameter && parent.parent.kind === ts.SyntaxKind.MappedType ||
            parent.kind === ts.SyntaxKind.TypeParameter && typeParameterMayBeRequired(parent, usage))
            return true;
        if (/\.tsx?$/.test(sourceFile.fileName) && !sourceFile.isDeclarationFile && opts.ignoreImports) {
            switch (parent.kind) {
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    if (parent.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference)
                        return true;
                    break;
                case ts.SyntaxKind.NamespaceImport:
                case ts.SyntaxKind.ImportSpecifier:
                case ts.SyntaxKind.ImportClause:
                    return true;
            }
        }
    }
    return false;
}
function typeParameterMayBeRequired(parameter, usage) {
    var parent = parameter.parent;
    switch (parent.kind) {
        default:
            return false;
        case ts.SyntaxKind.InterfaceDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
            if (typeParameterIsUsed(parameter, usage))
                return true;
            if (parent.name === undefined)
                return false;
            var variable = usage.get(parent.name);
            if (!variable.exported)
                return variable.inGlobalScope;
    }
    parent = parent.parent;
    while (true) {
        switch (parent.kind) {
            case ts.SyntaxKind.ModuleBlock:
                parent = parent.parent;
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                if (parent.name.kind !== ts.SyntaxKind.Identifier)
                    return true;
                var variable = usage.get(parent.name);
                if (!variable.exported)
                    return variable.inGlobalScope;
                parent = parent.parent;
                break;
            default:
                return false;
        }
    }
}
function typeParameterIsUsed(parameter, usage) {
    if (usage.get(parameter.name).uses.length !== 0)
        return true;
    var parent = parameter.parent;
    if (parent.name === undefined)
        return false;
    var index = parent.typeParameters.indexOf(parameter);
    for (var _i = 0, _a = usage.get(parent.name).declarations; _i < _a.length; _i++) {
        var declaration = _a[_i];
        var declarationParent = declaration.parent;
        if (declarationParent === parent)
            continue;
        switch (declarationParent.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
                if (declarationParent.typeParameters !== undefined &&
                    declarationParent.typeParameters.length > index &&
                    usage.get(declarationParent.typeParameters[index].name).uses.length !== 0)
                    return true;
        }
    }
    return false;
}
function showKind(node) {
    switch (node.parent.kind) {
        case ts.SyntaxKind.BindingElement:
        case ts.SyntaxKind.VariableDeclaration:
            return 'Variable';
        case ts.SyntaxKind.Parameter:
            return 'Parameter';
        case ts.SyntaxKind.FunctionDeclaration:
            return 'Function';
        case ts.SyntaxKind.ClassDeclaration:
            return 'Class';
        case ts.SyntaxKind.InterfaceDeclaration:
            return 'Interface';
        case ts.SyntaxKind.ImportClause:
        case ts.SyntaxKind.NamespaceImport:
        case ts.SyntaxKind.ImportSpecifier:
        case ts.SyntaxKind.ImportEqualsDeclaration:
            return 'Import';
        case ts.SyntaxKind.EnumDeclaration:
            return 'Enum';
        case ts.SyntaxKind.ModuleDeclaration:
            return 'Namespace';
        case ts.SyntaxKind.TypeAliasDeclaration:
            return 'TypeAlias';
        case ts.SyntaxKind.TypeParameter:
            return 'TypeParameter';
        default:
            throw new Error("Unhandled kind " + node.parent.kind + ": " + ts.SyntaxKind[node.parent.kind]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9VbnVzZWRSdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm9VbnVzZWRSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFpQztBQUNqQyw2QkFBK0I7QUFDL0IsbUNBR2lCO0FBRWpCLElBQU0sK0JBQStCLEdBQUcsaUNBQWlDLENBQUM7QUFDMUUsSUFBTSw0QkFBNEIsR0FBRyw4QkFBOEIsQ0FBQztBQUNwRSxJQUFNLHdCQUF3QixHQUFHLG1CQUFtQixDQUFDO0FBQ3JELElBQU0scUJBQXFCLEdBQUcsZ0JBQWdCLENBQUM7QUFFL0M7SUFBMEIsZ0NBQXVCO0lBQWpEOztJQVNBLENBQUM7SUFSVSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDcEUsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUYsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEYsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0UsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFFLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBVEQsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBU2hEO0FBVFksb0JBQUk7QUF1QmpCO0lBQTJCLHdDQUE2QjtJQUF4RDs7SUF3Q0EsQ0FBQztJQXZDVSwyQkFBSSxHQUFYLFVBQVksVUFBeUI7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