import type {
  CellAttributes,
  CellRole,
  CellSnapshot,
  ColumnHeaderSnapshot,
} from "../types/elements/table";
import { SORT_TYPES } from "../types/elements/table";

import { enumAttribute, numericAttribute } from "./attribute";
import { snapshotChildren } from "./children";
import { resolveAccessibleName } from "./name";
import type { SnapshotTargetElement } from "./types";

export function snapshotColumnHeader(
  element: SnapshotTargetElement,
): ColumnHeaderSnapshot {
  const cell = snapshotCell("columnheader", element);

  return {
    role: "columnheader",
    name: cell.name,
    attributes: {
      ...cell.attributes,
      sort: enumAttribute(element.ariaSort, SORT_TYPES),
    },
    children: cell.children,
  };
}

type CellSnapshotFn = (element: SnapshotTargetElement) => CellSnapshot;

export function snapshotCellWithRole(role: CellRole): CellSnapshotFn {
  return (element) => snapshotCell(role, element);
}

function snapshotCell(
  role: CellRole,
  element: SnapshotTargetElement,
): CellSnapshot {
  return {
    role: role,
    name: resolveAccessibleName(element),
    attributes: cellAttributes(element),
    children: snapshotChildren(element),
  };
}

function cellAttributes(element: SnapshotTargetElement): CellAttributes {
  if (element instanceof HTMLTableCellElement) {
    return {
      colSpan: resolveSpan(element.colSpan),
      rowSpan: resolveSpan(element.rowSpan),
    };
  }

  return {
    colSpan: resolveSpan(element.ariaColSpan),
    rowSpan: resolveSpan(element.ariaRowSpan),
  };
}

function resolveSpan(value: string | number | null): number | undefined {
  if (typeof value === "string") {
    value = numericAttribute(value) ?? null;
  }

  if (value === null || value === 1) {
    return undefined;
  }

  return value;
}
