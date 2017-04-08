import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as utils from 'tsutils';

import {isUndefined} from '../src/utils';

const FAIL_MESSAGE = `don't return explicit undefined`;
const ALLOW_VOID_EXPRESSION_OPTION = 'allow-void-expression';

interface IOptions {
    allowVoid: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, {
            allowVoid: this.ruleArguments.indexOf(ALLOW_VOID_EXPRESSION_OPTION) !== -1,
        });
    }
}

function walk(ctx: Lint.WalkContext<IOptions>) {
    for (const node of utils.flattenAst(ctx.sourceFile))
        if (utils.isReturnStatement(node) && node.expression !== undefined && isForbidden(node.expression, ctx.options.allowVoid))
            ctx.addFailureAtNode(node.expression, FAIL_MESSAGE);
}

function isForbidden(expression: ts.Expression, allowVoid: boolean) {
    return allowVoid ? isUndefinedNotVoidExpr(expression) : isUndefined(expression);
}

function isUndefinedNotVoidExpr(expression: ts.Expression): boolean {
    if (utils.isIdentifier(expression) && expression.text === 'undefined')
        return true;
    return utils.isVoidExpression(expression) && utils.isLiteralExpression(expression.expression);
}
