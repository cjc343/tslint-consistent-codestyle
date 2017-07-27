"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var utils = require("tsutils");
var rules_1 = require("../src/rules");
var PASCAL_OPTION = 'PascalCase';
var CAMEL_OPTION = 'camelCase';
var SNAKE_OPTION = 'snake_case';
var UPPER_OPTION = 'UPPER_CASE';
var FORMAT_FAIL = ' name must be in ';
var LEADING_FAIL = ' name must not have leading underscore';
var TRAILING_FAIL = ' name must not have trailing underscore';
var NO_LEADING_FAIL = ' name must have leading underscore';
var NO_TRAILING_FAIL = ' name must have trailing underscore';
var REGEX_FAIL = ' name did not match required regex';
var PREFIX_FAIL = ' name must start with ';
var SUFFIX_FAIL = ' name must end with ';
var PREFIX_FAIL_ARR = ' name must start with one of ';
var SUFFIX_FAIL_ARR = ' name must end with one of ';
var Types;
(function (Types) {
    Types[Types["default"] = -1] = "default";
    Types[Types["variable"] = 1] = "variable";
    Types[Types["function"] = 2] = "function";
    Types[Types["parameter"] = 4] = "parameter";
    Types[Types["member"] = 8] = "member";
    Types[Types["property"] = 16] = "property";
    Types[Types["method"] = 32] = "method";
    Types[Types["type"] = 64] = "type";
    Types[Types["class"] = 128] = "class";
    Types[Types["interface"] = 256] = "interface";
    Types[Types["typeAlias"] = 512] = "typeAlias";
    Types[Types["genericTypeParameter"] = 1024] = "genericTypeParameter";
    Types[Types["enum"] = 2048] = "enum";
    Types[Types["enumMember"] = 4096] = "enumMember";
})(Types || (Types = {}));
var TypeSelector;
(function (TypeSelector) {
    TypeSelector[TypeSelector["variable"] = 1] = "variable";
    TypeSelector[TypeSelector["function"] = 3] = "function";
    TypeSelector[TypeSelector["parameter"] = 5] = "parameter";
    TypeSelector[TypeSelector["property"] = 24] = "property";
    TypeSelector[TypeSelector["parameterProperty"] = 29] = "parameterProperty";
    TypeSelector[TypeSelector["method"] = 40] = "method";
    TypeSelector[TypeSelector["class"] = 192] = "class";
    TypeSelector[TypeSelector["interface"] = 320] = "interface";
    TypeSelector[TypeSelector["typeAlias"] = 576] = "typeAlias";
    TypeSelector[TypeSelector["genericTypeParameter"] = 1088] = "genericTypeParameter";
    TypeSelector[TypeSelector["enum"] = 2112] = "enum";
    TypeSelector[TypeSelector["enumMember"] = 4120] = "enumMember";
})(TypeSelector || (TypeSelector = {}));
var Modifiers;
(function (Modifiers) {
    Modifiers[Modifiers["const"] = 1] = "const";
    Modifiers[Modifiers["readonly"] = 1] = "readonly";
    Modifiers[Modifiers["static"] = 2] = "static";
    Modifiers[Modifiers["public"] = 4] = "public";
    Modifiers[Modifiers["protected"] = 8] = "protected";
    Modifiers[Modifiers["private"] = 16] = "private";
    Modifiers[Modifiers["global"] = 32] = "global";
    Modifiers[Modifiers["local"] = 64] = "local";
    Modifiers[Modifiers["abstract"] = 128] = "abstract";
    Modifiers[Modifiers["export"] = 256] = "export";
    Modifiers[Modifiers["import"] = 512] = "import";
    Modifiers[Modifiers["rename"] = 1024] = "rename";
})(Modifiers || (Modifiers = {}));
var Specifity;
(function (Specifity) {
    Specifity[Specifity["const"] = 1] = "const";
    Specifity[Specifity["readonly"] = 1] = "readonly";
    Specifity[Specifity["static"] = 2] = "static";
    Specifity[Specifity["global"] = 2] = "global";
    Specifity[Specifity["local"] = 2] = "local";
    Specifity[Specifity["public"] = 4] = "public";
    Specifity[Specifity["protected"] = 4] = "protected";
    Specifity[Specifity["private"] = 4] = "private";
    Specifity[Specifity["abstract"] = 8] = "abstract";
    Specifity[Specifity["export"] = 16] = "export";
    Specifity[Specifity["import"] = 32] = "import";
    Specifity[Specifity["rename"] = 64] = "rename";
    Specifity[Specifity["filter"] = 128] = "filter";
    Specifity[Specifity["default"] = 256] = "default";
    Specifity[Specifity["variable"] = 512] = "variable";
    Specifity[Specifity["function"] = 768] = "function";
    Specifity[Specifity["parameter"] = 1024] = "parameter";
    Specifity[Specifity["member"] = 1280] = "member";
    Specifity[Specifity["property"] = 1536] = "property";
    Specifity[Specifity["method"] = 1536] = "method";
    Specifity[Specifity["enumMember"] = 1792] = "enumMember";
    Specifity[Specifity["type"] = 2048] = "type";
    Specifity[Specifity["class"] = 2304] = "class";
    Specifity[Specifity["interface"] = 2304] = "interface";
    Specifity[Specifity["typeAlias"] = 2304] = "typeAlias";
    Specifity[Specifity["genericTypeParameter"] = 2304] = "genericTypeParameter";
    Specifity[Specifity["enum"] = 2304] = "enum";
})(Specifity || (Specifity = {}));
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new IdentifierNameWalker(sourceFile, this.ruleName, this.ruleArguments.map(function (rule) { return new NormalizedConfig(rule); }).sort(NormalizedConfig.sort)));
    };
    return Rule;
}(rules_1.AbstractConfigDependentRule));
exports.Rule = Rule;
var NormalizedConfig = (function () {
    function NormalizedConfig(raw) {
        this._type = Types[raw.type];
        this._final = !!raw.final;
        this._specifity = Specifity[raw.type];
        this._modifiers = 0;
        if (raw.modifiers !== undefined) {
            if (Array.isArray(raw.modifiers)) {
                for (var _i = 0, _a = raw.modifiers; _i < _a.length; _i++) {
                    var modifier = _a[_i];
                    this._modifiers |= Modifiers[modifier];
                    this._specifity |= Specifity[modifier];
                }
            }
            else {
                this._modifiers = Modifiers[raw.modifiers];
                this._specifity |= Specifity[raw.modifiers];
            }
        }
        if (raw.filter !== undefined) {
            this._filter = new RegExp(raw.filter);
            this._specifity |= Specifity.filter;
        }
        else {
            this._filter = undefined;
        }
        this._format = raw;
    }
    NormalizedConfig.prototype.matches = function (type, modifiers, name) {
        if (this._final && type > this._type << 1)
            return [false, false];
        if ((this._type & type) === 0 || (this._modifiers & ~modifiers) !== 0)
            return [false, false];
        if (this._filter === undefined)
            return [true, false];
        return [this._filter.test(name), true];
    };
    NormalizedConfig.prototype.getFormat = function () {
        return this._format;
    };
    NormalizedConfig.sort = function (first, second) {
        return first._specifity - second._specifity;
    };
    return NormalizedConfig;
}());
var NameChecker = (function () {
    function NameChecker(_type, format) {
        this._type = _type;
        this._leadingUnderscore = format.leadingUnderscore;
        this._trailingUnderscore = format.trailingUnderscore;
        this._format = parseOptionArray(format.format);
        this._prefix = parseOptionArray(format.prefix);
        this._suffix = parseOptionArray(format.suffix);
        this._regex = format.regex ? new RegExp(format.regex) : undefined;
    }
    NameChecker.prototype._failMessage = function (message) {
        return TypeSelector[this._type] + message;
    };
    NameChecker.prototype.check = function (name, walker) {
        var identifier = name.text;
        if (this._regex !== undefined && !this._regex.test(identifier))
            walker.addFailureAtNode(name, this._failMessage(REGEX_FAIL));
        if (this._leadingUnderscore) {
            if (identifier[0] === '_') {
                if (this._leadingUnderscore === 'forbid')
                    walker.addFailureAtNode(name, this._failMessage(LEADING_FAIL));
                identifier = identifier.slice(1);
            }
            else if (this._leadingUnderscore === 'require') {
                walker.addFailureAtNode(name, this._failMessage(NO_LEADING_FAIL));
            }
        }
        if (this._trailingUnderscore) {
            if (identifier[identifier.length - 1] === '_') {
                if (this._trailingUnderscore === 'forbid')
                    walker.addFailureAtNode(name, this._failMessage(TRAILING_FAIL));
                identifier = identifier.slice(0, -1);
            }
            else if (this._trailingUnderscore === 'require') {
                walker.addFailureAtNode(name, this._failMessage(NO_TRAILING_FAIL));
            }
        }
        if (this._prefix) {
            if (Array.isArray(this._prefix)) {
                identifier = this._checkPrefixes(identifier, name, this._prefix, walker);
            }
            else if (identifier.startsWith(this._prefix)) {
                identifier = identifier.slice(this._prefix.length);
            }
            else {
                walker.addFailureAtNode(name, this._failMessage(PREFIX_FAIL + this._prefix));
            }
        }
        if (this._suffix) {
            if (Array.isArray(this._suffix)) {
                identifier = this._checkSuffixes(identifier, name, this._suffix, walker);
            }
            else if (identifier.endsWith(this._suffix)) {
                identifier = identifier.slice(0, -this._suffix.length);
            }
            else {
                walker.addFailureAtNode(name, this._failMessage(SUFFIX_FAIL + this._suffix));
            }
        }
        if (this._format) {
            if (Array.isArray(this._format)) {
                if (!matchesAnyFormat(identifier, this._format))
                    walker.addFailureAtNode(name, this._failMessage(FORMAT_FAIL + formatFormatList(this._format)));
            }
            else if (!matchesFormat(identifier, this._format)) {
                walker.addFailureAtNode(name, this._failMessage(FORMAT_FAIL + this._format));
            }
        }
    };
    NameChecker.prototype._checkPrefixes = function (identifier, name, prefixes, walker) {
        for (var _i = 0, prefixes_1 = prefixes; _i < prefixes_1.length; _i++) {
            var prefix = prefixes_1[_i];
            if (identifier.startsWith(prefix))
                return identifier.slice(prefix.length);
        }
        walker.addFailureAtNode(name, this._failMessage(PREFIX_FAIL_ARR + prefixes.toString()));
        return identifier;
    };
    NameChecker.prototype._checkSuffixes = function (identifier, name, suffixes, walker) {
        for (var _i = 0, suffixes_1 = suffixes; _i < suffixes_1.length; _i++) {
            var suffix = suffixes_1[_i];
            if (identifier.endsWith(suffix))
                return identifier.slice(-suffix.length);
        }
        walker.addFailureAtNode(name, this._failMessage(SUFFIX_FAIL_ARR + suffixes.toString()));
        return identifier;
    };
    return NameChecker;
}());
var IdentifierNameWalker = (function (_super) {
    tslib_1.__extends(IdentifierNameWalker, _super);
    function IdentifierNameWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._depth = 0;
        _this._cache = new Map();
        return _this;
    }
    IdentifierNameWalker.prototype._checkTypeParameters = function (node, modifiers) {
        if (node.typeParameters !== undefined)
            for (var _i = 0, _a = node.typeParameters; _i < _a.length; _i++) {
                var name = _a[_i].name;
                this._checkName(name, TypeSelector.genericTypeParameter, modifiers);
            }
    };
    IdentifierNameWalker.prototype.visitEnumDeclaration = function (node) {
        var modifiers = this._getModifiers(node, TypeSelector.enum);
        this._checkName(node.name, TypeSelector.enum, modifiers);
        modifiers |= Modifiers.static | Modifiers.public | Modifiers.readonly;
        for (var _i = 0, _a = node.members; _i < _a.length; _i++) {
            var name = _a[_i].name;
            if (utils.isIdentifier(name))
                this._checkName(name, TypeSelector.enumMember, modifiers);
        }
    };
    IdentifierNameWalker.prototype.visitTypeAliasDeclaration = function (node) {
        this._checkDeclaration(node, TypeSelector.typeAlias);
        this._checkTypeParameters(node, Modifiers.global);
    };
    IdentifierNameWalker.prototype.visitClassExpression = function (node) {
        if (node.name !== undefined)
            this._checkDeclaration(node, TypeSelector.class);
        this._checkTypeParameters(node, Modifiers.global);
    };
    IdentifierNameWalker.prototype.visitClassDeclaration = function (node) {
        if (node.name !== undefined)
            this._checkDeclaration(node, TypeSelector.class);
        this._checkTypeParameters(node, Modifiers.global);
    };
    IdentifierNameWalker.prototype.visitMethodDeclaration = function (node) {
        if (isNameIdentifier(node))
            this._checkDeclaration(node, TypeSelector.method);
        this._checkTypeParameters(node, Modifiers.local);
    };
    IdentifierNameWalker.prototype.visitInterfaceDeclaration = function (node) {
        this._checkDeclaration(node, TypeSelector.interface);
        this._checkTypeParameters(node, Modifiers.global);
    };
    IdentifierNameWalker.prototype.visitParameterDeclaration = function (node) {
        var _this = this;
        if (isNameIdentifier(node)) {
            if (node.name.originalKeywordKind === ts.SyntaxKind.ThisKeyword)
                return;
            this._checkDeclaration(node, utils.isParameterProperty(node) ? TypeSelector.parameterProperty
                : TypeSelector.parameter);
        }
        else {
            utils.forEachDestructuringIdentifier(node.name, function (declaration) {
                _this._checkName(declaration.name, TypeSelector.parameter, Modifiers.local | (isEqualName(declaration.name, declaration.propertyName) ? 0 : Modifiers.rename));
            });
        }
    };
    IdentifierNameWalker.prototype.visitPropertyDeclaration = function (node) {
        if (isNameIdentifier(node))
            this._checkDeclaration(node, TypeSelector.property);
    };
    IdentifierNameWalker.prototype.visitSetAccessor = function (node) {
        if (isNameIdentifier(node))
            this._checkDeclaration(node, TypeSelector.property);
    };
    IdentifierNameWalker.prototype.visitGetAccessor = function (node) {
        if (isNameIdentifier(node))
            this._checkDeclaration(node, TypeSelector.property);
    };
    IdentifierNameWalker.prototype._checkVariableDeclarationList = function (list, modifiers) {
        var _this = this;
        if ((list.flags & ts.NodeFlags.Const) !== 0)
            modifiers |= Modifiers.const;
        utils.forEachDeclaredVariable(list, function (declaration) {
            _this._checkName(declaration.name, TypeSelector.variable, modifiers | (isEqualName(declaration.name, declaration.propertyName) ? 0 : Modifiers.rename));
        });
    };
    IdentifierNameWalker.prototype.visitForStatement = function (node) {
        if (node.initializer !== undefined && utils.isVariableDeclarationList(node.initializer))
            this._checkVariableDeclarationList(node.initializer, this._getModifiers(node.initializer, TypeSelector.variable));
    };
    IdentifierNameWalker.prototype.visitForOfStatement = function (node) {
        if (utils.isVariableDeclarationList(node.initializer))
            this._checkVariableDeclarationList(node.initializer, this._getModifiers(node.initializer, TypeSelector.variable));
    };
    IdentifierNameWalker.prototype.visitForInStatement = function (node) {
        if (utils.isVariableDeclarationList(node.initializer))
            this._checkVariableDeclarationList(node.initializer, this._getModifiers(node.initializer, TypeSelector.variable));
    };
    IdentifierNameWalker.prototype.visitVariableStatement = function (node) {
        if (!utils.hasModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword))
            this._checkVariableDeclarationList(node.declarationList, this._getModifiers(node, TypeSelector.variable));
    };
    IdentifierNameWalker.prototype.visitFunctionDeclaration = function (node) {
        if (node.name !== undefined)
            this._checkDeclaration(node, TypeSelector.function);
        this._checkTypeParameters(node, Modifiers.local);
    };
    IdentifierNameWalker.prototype.visitFuncitonExpression = function (node) {
        if (node.name !== undefined)
            this._checkDeclaration(node, TypeSelector.function);
        this._checkTypeParameters(node, Modifiers.local);
    };
    IdentifierNameWalker.prototype.visitArrowFunction = function (node) {
        this._checkTypeParameters(node, Modifiers.local);
    };
    IdentifierNameWalker.prototype._checkDeclaration = function (node, type) {
        this._checkName(node.name, type, this._getModifiers(node, type));
    };
    IdentifierNameWalker.prototype._checkName = function (name, type, modifiers) {
        var matchingChecker = this._getMatchingChecker(type, modifiers, name.text);
        if (matchingChecker !== null)
            matchingChecker.check(name, this);
    };
    IdentifierNameWalker.prototype._getMatchingChecker = function (type, modifiers, name) {
        var key = type + "," + modifiers;
        var cached = this._cache.get(key);
        if (cached !== undefined)
            return cached;
        var _a = this._createChecker(type, modifiers, name), checker = _a[0], hasFilter = _a[1];
        if (!hasFilter)
            this._cache.set(key, checker);
        return checker;
    };
    IdentifierNameWalker.prototype._createChecker = function (type, modifiers, name) {
        var hasFilter = false;
        var config = this.options.reduce(function (format, rule) {
            var _a = rule.matches(type, modifiers, name), matches = _a[0], filterUsed = _a[1];
            if (!matches)
                return format;
            if (filterUsed)
                hasFilter = true;
            return Object.assign(format, rule.getFormat());
        }, {
            leadingUnderscore: undefined,
            trailingUnderscore: undefined,
            format: undefined,
            prefix: undefined,
            regex: undefined,
            suffix: undefined,
        });
        if (!config.leadingUnderscore &&
            !config.trailingUnderscore &&
            !config.format &&
            !config.prefix &&
            !config.regex &&
            !config.suffix)
            return [null, hasFilter];
        return [new NameChecker(type, config), hasFilter];
    };
    IdentifierNameWalker.prototype._getModifiers = function (node, type) {
        var modifiers = 0;
        if (node.modifiers !== undefined) {
            if (type | Types.member) {
                if (utils.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword)) {
                    modifiers |= Modifiers.private;
                }
                else if (utils.hasModifier(node.modifiers, ts.SyntaxKind.ProtectedKeyword)) {
                    modifiers |= Modifiers.protected;
                }
                else {
                    modifiers |= Modifiers.public;
                }
                if (utils.hasModifier(node.modifiers, ts.SyntaxKind.ReadonlyKeyword))
                    modifiers |= Modifiers.const;
                if (utils.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword))
                    modifiers |= Modifiers.static;
            }
            if (utils.hasModifier(node.modifiers, ts.SyntaxKind.ConstKeyword))
                modifiers |= Modifiers.const;
            if (utils.hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword))
                modifiers |= Modifiers.export;
            if (utils.hasModifier(node.modifiers, ts.SyntaxKind.AbstractKeyword))
                modifiers |= Modifiers.abstract;
        }
        if (type !== TypeSelector.property && type !== TypeSelector.method)
            modifiers |= this._depth !== 0 ? Modifiers.local : Modifiers.global;
        return modifiers;
    };
    IdentifierNameWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            _this.visitNode(node);
            if (utils.isScopeBoundary(node)) {
                ++_this._depth;
                ts.forEachChild(node, cb);
                --_this._depth;
            }
            else {
                return ts.forEachChild(node, cb);
            }
        };
        return ts.forEachChild(sourceFile, cb);
    };
    IdentifierNameWalker.prototype.visitNode = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.VariableStatement:
                return this.visitVariableStatement(node);
            case ts.SyntaxKind.FunctionDeclaration:
                return this.visitFunctionDeclaration(node);
            case ts.SyntaxKind.FunctionExpression:
                return this.visitFuncitonExpression(node);
            case ts.SyntaxKind.ForStatement:
                return this.visitForStatement(node);
            case ts.SyntaxKind.ForInStatement:
                return this.visitForInStatement(node);
            case ts.SyntaxKind.ForOfStatement:
                return this.visitForOfStatement(node);
            case ts.SyntaxKind.Parameter:
                return this.visitParameterDeclaration(node);
            case ts.SyntaxKind.ClassDeclaration:
                return this.visitClassDeclaration(node);
            case ts.SyntaxKind.ClassExpression:
                return this.visitClassExpression(node);
            case ts.SyntaxKind.InterfaceDeclaration:
                return this.visitInterfaceDeclaration(node);
            case ts.SyntaxKind.EnumDeclaration:
                return this.visitEnumDeclaration(node);
            case ts.SyntaxKind.TypeAliasDeclaration:
                return this.visitTypeAliasDeclaration(node);
            case ts.SyntaxKind.PropertyDeclaration:
                return this.visitPropertyDeclaration(node);
            case ts.SyntaxKind.MethodDeclaration:
                return this.visitMethodDeclaration(node);
            case ts.SyntaxKind.GetAccessor:
                return this.visitGetAccessor(node);
            case ts.SyntaxKind.SetAccessor:
                return this.visitSetAccessor(node);
            case ts.SyntaxKind.ArrowFunction:
                return this.visitArrowFunction(node);
        }
    };
    return IdentifierNameWalker;
}(Lint.AbstractWalker));
function parseOptionArray(option) {
    if (!Array.isArray(option) || option.length > 1)
        return option;
    return option[0];
}
function matchesFormat(identifier, format) {
    switch (format) {
        case PASCAL_OPTION:
            return isPascalCase(identifier);
        case CAMEL_OPTION:
            return isCamelCase(identifier);
        case SNAKE_OPTION:
            return isSnakeCase(identifier);
        case UPPER_OPTION:
            return isUpperCase(identifier);
    }
}
function matchesAnyFormat(identifier, formats) {
    for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
        var format = formats_1[_i];
        if (matchesFormat(identifier, format))
            return true;
    }
    return false;
}
function formatFormatList(formats) {
    var result = formats[0];
    var lastIndex = formats.length - 1;
    for (var i = 1; i < lastIndex; ++i)
        result += ', ' + formats[i];
    return result + ' or ' + formats[lastIndex];
}
function isPascalCase(name) {
    return name.length === 0 || name[0] === name[0].toUpperCase() && hasStrictCamelHumps(name, true);
}
function isCamelCase(name) {
    return name.length === 0 || name[0] === name[0].toLowerCase() && hasStrictCamelHumps(name, false);
}
function hasStrictCamelHumps(name, isUpper) {
    if (name[0] === '_')
        return false;
    for (var i = 1; i < name.length; ++i) {
        if (name[i] === '_')
            return false;
        if (isUpper === isUppercaseChar(name[i])) {
            if (isUpper)
                return false;
        }
        else {
            isUpper = !isUpper;
        }
    }
    return true;
}
function isUppercaseChar(char) {
    return char === char.toUpperCase() && char !== char.toLowerCase();
}
function isSnakeCase(name) {
    return name === name.toLowerCase() && validateUnderscores(name);
}
function isUpperCase(name) {
    return name === name.toUpperCase() && validateUnderscores(name);
}
function validateUnderscores(name) {
    if (name[0] === '_')
        return false;
    var wasUnderscore = false;
    for (var i = 1; i < name.length; ++i) {
        if (name[i] === '_') {
            if (wasUnderscore)
                return false;
            wasUnderscore = true;
        }
        else {
            wasUnderscore = false;
        }
    }
    return !wasUnderscore;
}
function isNameIdentifier(node) {
    return node.name.kind === ts.SyntaxKind.Identifier;
}
function isEqualName(name, propertyName) {
    return propertyName === undefined ||
        (propertyName.kind === ts.SyntaxKind.Identifier && propertyName.text === name.text);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtaW5nQ29udmVudGlvblJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuYW1pbmdDb252ZW50aW9uUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBaUM7QUFDakMsNkJBQStCO0FBQy9CLCtCQUFpQztBQUVqQyxzQ0FBMkQ7QUFRM0QsSUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFJLFdBQVcsQ0FBQztBQUNsQyxJQUFNLFlBQVksR0FBSSxZQUFZLENBQUM7QUFDbkMsSUFBTSxZQUFZLEdBQUksWUFBWSxDQUFDO0FBRW5DLElBQU0sV0FBVyxHQUFLLG1CQUFtQixDQUFDO0FBQzFDLElBQU0sWUFBWSxHQUFJLHdDQUF3QyxDQUFDO0FBQy9ELElBQU0sYUFBYSxHQUFHLHlDQUF5QyxDQUFDO0FBQ2hFLElBQU0sZUFBZSxHQUFJLG9DQUFvQyxDQUFDO0FBQzlELElBQU0sZ0JBQWdCLEdBQUcscUNBQXFDLENBQUM7QUFDL0QsSUFBTSxVQUFVLEdBQU0sb0NBQW9DLENBQUM7QUFDM0QsSUFBTSxXQUFXLEdBQUssd0JBQXdCLENBQUM7QUFDL0MsSUFBTSxXQUFXLEdBQUssc0JBQXNCLENBQUM7QUFDN0MsSUFBTSxlQUFlLEdBQUksK0JBQStCLENBQUM7QUFDekQsSUFBTSxlQUFlLEdBQUksNkJBQTZCLENBQUM7QUFJdkQsSUFBSyxLQWlCSjtBQWpCRCxXQUFLLEtBQUs7SUFFTix3Q0FBWSxDQUFBO0lBQ1oseUNBQVksQ0FBQTtJQUNaLHlDQUFpQixDQUFBO0lBQ2pCLDJDQUFrQixDQUFBO0lBQ2xCLHFDQUFlLENBQUE7SUFDZiwwQ0FBaUIsQ0FBQTtJQUNqQixzQ0FBZSxDQUFBO0lBQ2Ysa0NBQWEsQ0FBQTtJQUNiLHFDQUFjLENBQUE7SUFDZCw2Q0FBa0IsQ0FBQTtJQUNsQiw2Q0FBa0IsQ0FBQTtJQUNsQixvRUFBOEIsQ0FBQTtJQUM5QixvQ0FBYyxDQUFBO0lBQ2QsZ0RBQW9CLENB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