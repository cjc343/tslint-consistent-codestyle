"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var AbstractReturnStatementWalker = (function (_super) {
    tslib_1.__extends(AbstractReturnStatementWalker, _super);
    function AbstractReturnStatementWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractReturnStatementWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (node.kind === ts.SyntaxKind.ReturnStatement)
                _this._checkReturnStatement(node);
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    return AbstractReturnStatementWalker;
}(Lint.AbstractWalker));
exports.AbstractReturnStatementWalker = AbstractReturnStatementWalker;
var AbstractIfStatementWalker = (function (_super) {
    tslib_1.__extends(AbstractIfStatementWalker, _super);
    function AbstractIfStatementWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractIfStatementWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (node.kind === ts.SyntaxKind.IfStatement)
                _this._checkIfStatement(node);
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    return AbstractIfStatementWalker;
}(Lint.AbstractWalker));
exports.AbstractIfStatementWalker = AbstractIfStatementWalker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsa2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2Fsa2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFpQztBQUNqQyw2QkFBK0I7QUFFL0I7SUFBK0QseURBQXNCO0lBQXJGOztJQVdBLENBQUM7SUFWVSw0Q0FBSSxHQUFYLFVBQVksVUFBeUI7UUFBckMsaUJBT0M7UUFORyxJQUFNLEVBQUUsR0FBRyxVQUFDLElBQWE7WUFDckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztnQkFDNUMsS0FBSSxDQUFDLHFCQUFxQixDQUFxQixJQUFJLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFHTCxvQ0FBQztBQUFELENBQUMsQUFYRCxDQUErRCxJQUFJLENBQUMsY0FBYyxHQVdqRjtBQVhxQixzRUFBNkI7QUFhbkQ7SUFBMkQscURBQXNCO0lBQWpGOztJQVdBLENBQUM7SUFWVSx3Q0FBSSxHQUFYLFVBQVksVUFBeUI7UUFBckMsaUJBT0M7UUFORyxJQUFNLEVBQUUsR0FBRyxVQUFDLElBQWE7WUFDckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztnQkFDeEMsS0FBSSxDQUFDLGlCQUFpQixDQUFpQixJQUFJLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFHTCxnQ0FBQztBQUFELENBQUMsQUFYRCxDQUEyRCxJQUFJLENBQUMsY0FBYyxHQVc3RTtBQVhxQiw4REFBeUIifQ==