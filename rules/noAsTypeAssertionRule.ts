import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as utils from 'tsutils';

const FAIL_MESSAGE = 'use <Type> instead of `as Type`';

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new AsExpressionWalker(sourceFile, this.ruleName, undefined));
    }
}

export class AsExpressionWalker extends Lint.AbstractWalker<void> {
    public walk(sourceFile: ts.SourceFile) {
        for (const node of utils.flattenAst(sourceFile))
            if (node.kind === ts.SyntaxKind.AsExpression)
                this._reportError(<ts.AsExpression>node);
    }

    private _reportError(node: ts.AsExpression) {
        const start = utils.getChildOfKind(node, ts.SyntaxKind.AsKeyword, this.sourceFile)!.getStart(this.sourceFile);
        this.addFailure(start, node.end, FAIL_MESSAGE, [
            Lint.Replacement.appendText(getInsertionPosition(node, this.sourceFile), `<${node.type.getText(this.sourceFile)}>`),
            Lint.Replacement.deleteFromTo(node.expression.end, node.end),
        ]);
    }

}

function getInsertionPosition(node: ts.AsExpression, sourceFile: ts.SourceFile): number {
        let expression = node.expression;
        while (utils.isAssertionExpression(expression))
            expression = expression.expression;
        return expression.getStart(sourceFile);
}
