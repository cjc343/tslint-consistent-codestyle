import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as utils from 'tsutils';
import { isElseIf } from '../src/utils';

const FAIL_MESSAGE = `unnecessary else`;

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    for (const node of utils.flattenAst(ctx.sourceFile))
        if (utils.isIfStatement(node) &&
            node.elseStatement !== undefined &&
            !isElseIf(node) &&
            utils.endsControlFlow(node.thenStatement))
            ctx.addFailureAt(node.elseStatement.pos - 4, 4, FAIL_MESSAGE);
}
