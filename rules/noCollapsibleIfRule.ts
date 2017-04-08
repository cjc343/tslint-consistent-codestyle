import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as utils from 'tsutils';

const FAIL_MERGE_IF = `if statements can be merged`;
const FAIL_MERGE_ELSE_IF = `if statement can be merged with previous else`;

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    for (const node of utils.flattenAst(ctx.sourceFile)) {
        if (!utils.isIfStatement(node))
            continue;
        if (node.elseStatement === undefined) {
            let then = node.thenStatement;
            if (utils.isBlockLike(then) && then.statements.length === 1)
                then = then.statements[0];
            if (utils.isIfStatement(then) && then.elseStatement === undefined) {
                const end = then.thenStatement.pos;
                ctx.addFailure(node.getStart(ctx.sourceFile), end, FAIL_MERGE_IF);
            }
        } else if (utils.isBlockLike(node.elseStatement) &&
                   node.elseStatement.statements.length === 1 &&
                   utils.isIfStatement(node.elseStatement.statements[0])) {
            const start = node.elseStatement.pos - 4;
            const end = (<ts.IfStatement>node.elseStatement.statements[0]).thenStatement.pos;
            ctx.addFailure(start, end, FAIL_MERGE_ELSE_IF);
        }
    }
}
