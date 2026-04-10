export interface SnapshotSerializer<TValue> {
  /**
   * The file extension associated with the serialized value
   */
  readonly fileExtension: string;

  /**
   * Serializes value
   *
   * @param value The value to be serialized
   * @return {string} The serialized value
   * @throws {Error} Will throw an error if value cannot be serialized.
   */
  serialize(value: TValue): string;
}
