import type { SourceInfo } from "./types";
import nodePath from "node:path";
import interpolate from "@cstrlcs/interpolate";
import Bun, { $ } from "bun";

import { cameraApis, cameraHandednesses } from "./camera";
import { eulerOrders } from "./euler";
import { getNamespaceExports, getSourceInfoElements } from "./extractor";
import types from "./types.json";

const ExportPaths = {
  Index: "src/index.ts",
  Docs: "DOCS.md",
} as const;

const TemplatePaths = {
  Index: "./codegen/templates/index.interpolate",
  Docs: "./codegen/templates/docs.interpolate",
  CameraMod: "./codegen/templates/camera_mod.interpolate",
  CameraProj: "./codegen/templates/camera_proj.interpolate",
  CameraView: "./codegen/templates/camera_view.interpolate",
} as const;

async function render(template: string, outputPath: string, data: object) {
  await Bun.write(outputPath, interpolate(await Bun.file(template).text(), data));
}

async function buildCamera() {
  await render(TemplatePaths.CameraMod, "src/camera/index.ts", {
    level: "camera",
    handednesses: cameraHandednesses,
  });

  for (const handedness of cameraHandednesses) {
    const root = `src/camera/${handedness.name}`;

    await render(TemplatePaths.CameraMod, `${root}/index.ts`, { level: "handedness", handedness });

    await render(TemplatePaths.CameraMod, `${root}/proj/index.ts`, {
      level: "proj",
      handedness,
      apis: cameraApis,
    });

    await render(TemplatePaths.CameraView, `${root}/view.ts`, { handedness });

    for (const api of cameraApis) {
      await render(TemplatePaths.CameraProj, `${root}/proj/${api.name}.ts`, { handedness, api });
    }
  }
}

function collectModuleInfos(indexPath: string, prefix: string, moduleInfos: SourceInfo[]) {
  for (const { name, specifier, description } of getNamespaceExports(indexPath)) {
    const moduleName = `${prefix}${name}`;
    const moduleFile = specifier.replace(/\.js$/, ".ts");
    const modulePath = nodePath.join(nodePath.dirname(indexPath), moduleFile);
    const [summary = ""] = description.split(/\n\s*\n/);

    moduleInfos.push({
      name: moduleName,
      description: summary,
      elements: getSourceInfoElements(modulePath),
    });

    collectModuleInfos(modulePath, `${moduleName}.`, moduleInfos);
  }

  return moduleInfos;
}

async function build() {
  const sourceInfos: SourceInfo[] = [];

  for (const type of types) {
    const { name, length, description, template } = type;
    const path = `src/${name}${length ?? ""}.ts`;

    const renderedSourceCode = interpolate(await Bun.file(template).text(), {
      ...type,
      eulerOrders,
    });

    await Bun.write(path, renderedSourceCode);

    const elements = getSourceInfoElements(path);

    sourceInfos.push({
      name: `${name}${length ?? ""}`,
      description,
      elements,
    });
  }

  await buildCamera();

  const renderedIndex = interpolate(await Bun.file(TemplatePaths.Index).text(), { types });

  await Bun.write(ExportPaths.Index, renderedIndex);

  const renderedDocs = interpolate(await Bun.file(TemplatePaths.Docs).text(), {
    sourceInfos,
    moduleInfos: collectModuleInfos(ExportPaths.Index, "", []),
  });

  await Bun.write(ExportPaths.Docs, renderedDocs);
  await $`oxfmt src ${ExportPaths.Docs}`;
}

await build();
