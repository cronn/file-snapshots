export interface SnapshotSerializer {
  /**
   * The file extension associated with the serialized value
   */
  readonly fileExtension: string;

  /**
   * Returns true when value can be serialized
   *
   * @param value The value to be serialized
   */
  canSerialize(value: unknown): boolean;

  /**
   * Serializes value
   *
   * @param value The value to be serialized
   * @return {string} The serialized value
   * @throws {Error} Will throw an error if value cannot be serialized.
   */
  serialize(value: unknown): string;
}
