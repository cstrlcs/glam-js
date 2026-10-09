import type { SourceInfoElement } from "./types";
import ts from "typescript";

type DocumentedNode =
  | ts.FunctionDeclaration
  | ts.GetAccessorDeclaration
  | ts.MethodDeclaration
  | ts.PropertyAssignment
  | ts.PropertyDeclaration
  | ts.VariableDeclaration;

function hasJsDoc(node: ts.Node) {
  return "jsDoc" in node && Boolean(node.jsDoc);
}

function isExported(node: ts.FunctionDeclaration | ts.VariableStatement) {
  return node.modifiers?.some(({ kind }) => kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function isDocumented(node: ts.Node): node is DocumentedNode {
  if (ts.isFunctionDeclaration(node)) {
    return isExported(node);
  }

  if (
    ts.isMethodDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isPropertyDeclaration(node)
  ) {
    return !ts.isPrivateIdentifier(node.name);
  }

  if (ts.isPropertyAssignment(node)) {
    return hasJsDoc(node);
  }

  return (
    ts.isVariableDeclaration(node) &&
    ts.isVariableStatement(node.parent.parent) &&
    isExported(node.parent.parent)
  );
}

function extractNodeInfo(
  node: ts.Node,
  typeChecker: ts.TypeChecker,
  sourceInfoElements: SourceInfoElement[],
) {
  if (isDocumented(node)) {
    const docNode = ts.isVariableDeclaration(node) ? node.parent.parent : node;

    const element: SourceInfoElement = {
      type: typeChecker.typeToString(typeChecker.getTypeAtLocation(node)),
      name: node.name?.getText(),
    };

    if ("jsDoc" in docNode && docNode.jsDoc) {
      element.description = (docNode.jsDoc as { comment: string }[])
        .map(({ comment }) => comment)
        .join(" ");
    }

    sourceInfoElements.push(element);
  }

  ts.forEachChild(node, (child) => {
    extractNodeInfo(child, typeChecker, sourceInfoElements);
  });
}

export function getSourceInfoElements(path: string) {
  const program = ts.createProgram([path], {});
  const sourceFile = program.getSourceFile(path);

  if (!sourceFile) {
    return [];
  }

  const typeChecker = program.getTypeChecker();
  const sourceInfoElements: SourceInfoElement[] = [];

  ts.forEachChild(sourceFile, (node) => {
    extractNodeInfo(node, typeChecker, sourceInfoElements);
  });

  return sourceInfoElements;
}

export function getNamespaceExports(path: string) {
  const program = ts.createProgram([path], {});
  const sourceFile = program.getSourceFile(path);

  if (!sourceFile) {
    return [];
  }

  return sourceFile.statements.filter(ts.isExportDeclaration).flatMap((node) => {
    const { exportClause, moduleSpecifier } = node;

    if (
      !exportClause ||
      !ts.isNamespaceExport(exportClause) ||
      !moduleSpecifier ||
      !ts.isStringLiteral(moduleSpecifier)
    ) {
      return [];
    }

    const jsDoc = "jsDoc" in node ? (node.jsDoc as ts.JSDoc[]) : [];

    return [
      {
        name: exportClause.name.text,
        specifier: moduleSpecifier.text,
        description: jsDoc.map(({ comment }) => ts.getTextOfJSDocComment(comment)).join(" "),
      },
    ];
  });
}
