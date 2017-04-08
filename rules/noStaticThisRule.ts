import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as utils from 'tsutils';

const FAIL_MESSAGE = `don't use this in static methods`;

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    let checking = false;
    return utils.wrapAst(ctx.sourceFile).children.forEach(function cb({node, children}) {
        if (checking) {
            if (node.kind === ts.SyntaxKind.ThisKeyword)
                return ctx.addFailureAtNode(node, FAIL_MESSAGE);
            if (utils.hasOwnThisReference(node)) {
                checking = false;
                children.forEach(cb);
                checking = true;
                return;
            }
        } else if (isStaticMethod(node)) {
            checking = true;
            children.forEach(cb);
            checking = false;
            return;
        }
        return children.forEach(cb);
    });
}

function isStaticMethod(node: ts.Node): boolean {
    return (node.kind === ts.SyntaxKind.MethodDeclaration ||
            node.kind === ts.SyntaxKind.GetAccessor ||
            node.kind === ts.SyntaxKind.SetAccessor) &&
            utils.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword);
}
