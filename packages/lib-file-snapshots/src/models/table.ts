export interface TableData<TRow extends TableRow = TableRow> {
  columns: Array<string>;
  rows: Array<TRow>;
}

export type TableRow = Array<TableCell>;

export type TableCell = string | number | boolean | null | undefined;

type TableRowRecord = Record<string, TableCell>;

export class Table<
  TRow extends TableRow = TableRow,
> implements TableData<TRow> {
  public readonly columns: Array<string>;
  public readonly rows: Array<TRow>;

  private constructor(data: TableData<TRow>) {
    this.columns = data.columns;
    this.rows = data.rows;
  }

  /**
   * Defines a table
   */
  public static define<TRow extends TableRow>(
    data: TableData<TRow>,
  ): Table<TRow> {
    return new Table(data);
  }

  /**
   * Defines a table from record-based rows
   *
   * Columns are derived from keys, rows from values.
   */
  public static fromRecords<TRow extends TableRowRecord>(
    rows: Array<TRow>,
  ): Table {
    const [firstRow] = rows;

    return new Table({
      columns: firstRow !== undefined ? Object.keys(firstRow) : [],
      rows: rows.map((row) => Object.values(row)),
    });
  }
}
