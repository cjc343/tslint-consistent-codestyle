import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as utils from 'tsutils';

const FAIL_MESSAGE = `shorthand properties should come first`;

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    for (const node of utils.flattenAst(ctx.sourceFile))
        if (utils.isObjectLiteralExpression(node)) {
            let seenRegularProperty = false;
            for (const property of node.properties)
                if (property.kind === ts.SyntaxKind.PropertyAssignment) {
                    seenRegularProperty = true;
                } else if (property.kind === ts.SyntaxKind.SpreadAssignment) {
                    // reset at spread, because ordering matters
                    seenRegularProperty = false;
                } else if (seenRegularProperty && property.kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
                    ctx.addFailureAtNode(property, FAIL_MESSAGE);
                }
        }
}
