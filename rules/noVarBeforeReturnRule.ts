import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as utils from 'tsutils';

import { isUndefined } from '../src/utils';

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    for (const node of utils.flattenAst(ctx.sourceFile))
        if (utils.isReturnStatement(node) && node.expression !== undefined && utils.isIdentifier(node.expression)) {
            const statement = utils.getPreviousStatement(node);
            if (statement !== undefined && utils.isVariableStatement(statement)) {
                const declarations = statement.declarationList.declarations;
                const lastDeclaration = declarations[declarations.length - 1].name;
                if (utils.isIdentifier(lastDeclaration)) {
                    if (lastDeclaration.text !== node.expression.text)
                        continue;
                } else if (!isSimpleDestructuringForName(lastDeclaration, node.expression.text)) {
                    continue;
                }
                ctx.addFailureAtNode(node.expression, `don't declare variable ${node.expression.text} to return it immediately`);
            }
        }
}

function isSimpleDestructuringForName(pattern: ts.BindingPattern, name: string): boolean {
    const identifiersSeen = new Set<string>();
    interface IResult {
        result: boolean;
    }
    const result = utils.forEachDestructuringIdentifier(pattern, (element): IResult | undefined => {
        if (element.name.text !== name)
            return void identifiersSeen.add(element.name.text);
        if (element.dotDotDotToken !== undefined ||
            element.initializer !== undefined && !isUndefined(element.initializer))
            return {result: false};

        const property = element.propertyName;
        if (property === undefined)
            return {result: true};

        if (utils.isComputedPropertyName(property)) {
            if (utils.isIdentifier(property.expression))
                return {result: !identifiersSeen.has(property.expression.text)};
            if (utils.isLiteralExpression(property.expression))
                return {result: true};
            return {result: false};
        }
        return {result: true};
    });
    return result !== undefined && result.result;
}
