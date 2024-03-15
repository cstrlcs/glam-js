import Bun, { $ } from "bun";
import tinyplate from "tinyplate.js";
import { getSourceInfoElements } from "./extractor";
import type { SourceInfo } from "./types";
import types from "./types.json";

enum ExportPaths {
	Index = "src/index.ts",
	Docs = "DOCS.md",
}

enum TemplatePaths {
	Index = "./codegen/templates/index.txt",
	Docs = "./codegen/templates/docs.txt",
}

const WARN = {
	warn: "Do not edit this file directly. Edit the template instead: `<template>`.",
};

const build = async () => {
	const sourceInfos: SourceInfo[] = [];

	for (const type of types) {
		const { name, length, description, template } = type;
		const path = `src/${name}${length}.ts`;

		const renderedSourceCode = tinyplate(await Bun.file(template).text(), {
			...WARN,
			...type,
		});

		const elements = getSourceInfoElements(path);

		Bun.write(path, renderedSourceCode);
		await $`biome format --write ${path}`;

		sourceInfos.push({
			name,
			description,
			elements,
		});
	}

	const renderedIndex = tinyplate(await Bun.file(TemplatePaths.Index).text(), {
		...WARN,
		types,
	});

	const renderedDocs = tinyplate(await Bun.file(TemplatePaths.Docs).text(), {
		...WARN,
		sourceInfos,
	});

	Bun.write(ExportPaths.Index, renderedIndex);
	Bun.write(ExportPaths.Docs, renderedDocs);
};

build();
