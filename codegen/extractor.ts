import type { SourceInfoElement } from "./types";
import ts from "typescript";

const extractNodeInfo = (
	node: ts.Node,
	typeChecker: ts.TypeChecker,
	sourceInfoElements: SourceInfoElement[],
) => {
	if (
		ts.isFunctionDeclaration(node) ||
		ts.isMethodDeclaration(node) ||
		ts.isPropertyDeclaration(node)
	) {
		const element: SourceInfoElement = {
			type: typeChecker.typeToString(typeChecker.getTypeAtLocation(node)),
			name: node.name?.getText(),
		};

		if ("jsDoc" in node && node.jsDoc) {
			element.description = (node.jsDoc as { comment: string }[])
				.map(({ comment }) => comment)
				.join(" ");
		}

		sourceInfoElements.push(element);
	}

	ts.forEachChild(node, (node) =>
		extractNodeInfo(node, typeChecker, sourceInfoElements),
	);
};

export const getSourceInfoElements = (path: string): SourceInfoElement[] => {
	const program = ts.createProgram([path], {});
	const sourceFile = program.getSourceFile(path);

	if (!sourceFile) {
		return [];
	}

	const typeChecker = program.getTypeChecker();
	const sourceInfoElements: SourceInfoElement[] = [];

	ts.forEachChild(sourceFile, (node) =>
		extractNodeInfo(node, typeChecker, sourceInfoElements),
	);

	return sourceInfoElements;
};
