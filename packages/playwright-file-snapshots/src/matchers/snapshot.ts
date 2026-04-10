import { performance } from "node:perf_hooks";

import { waitForTimer } from "../utils/timer";

import type {
  RepeatableSnapshotValue,
  SnapshotValue,
  StaticSnapshotValue,
} from "./types";

interface Snapshot<TValue> {
  getValue: () => StaticSnapshotValue<TValue>;
}

export function createSnapshotInstance<TValue>(
  value: SnapshotValue<TValue>,
): StaticSnapshot<TValue> | RepeatableSnapshot<TValue> {
  if (isFunctionWithParameters(value)) {
    throw new Error(
      "Invalid snapshot value: only functions without parameters are supported.",
    );
  }

  if (isRepeatableSnapshotValue(value)) {
    return new RepeatableSnapshot<TValue>(value);
  }

  return new StaticSnapshot<TValue>(value);
}

function isFunctionWithParameters(value: unknown): boolean {
  return typeof value === "function" && value.length > 0;
}

function isRepeatableSnapshotValue<TValue>(
  value: SnapshotValue<TValue>,
): value is RepeatableSnapshotValue<TValue> {
  return typeof value === "function" && value.length === 0;
}

export class StaticSnapshot<TValue> implements Snapshot<TValue> {
  private readonly value: StaticSnapshotValue<TValue>;

  public constructor(value: StaticSnapshotValue<TValue>) {
    this.value = value;
  }

  public getValue(): StaticSnapshotValue<TValue> {
    return this.value;
  }
}

export class RepeatableSnapshot<TValue> implements Snapshot<TValue> {
  private readonly maxRetryInterval = 1000;
  private readonly retryIntervals = [100, 250, 500];
  private readonly startTime = performance.now();
  private snapshotCounter = 0;
  private readonly snapshotValueFn: RepeatableSnapshotValue<TValue>;

  public constructor(snapshotValueFn: RepeatableSnapshotValue<TValue>) {
    this.snapshotValueFn = snapshotValueFn;
  }

  public async getValue(): Promise<TValue> {
    const snapshot = await this.snapshotValueFn();
    this.snapshotCounter++;
    return snapshot;
  }

  public isTimeoutExceeded(timeout: number): boolean {
    const currentTime = performance.now();
    const executionTime = currentTime - this.startTime;

    return executionTime >= timeout;
  }

  public async waitForNextRetry(): Promise<void> {
    const retryInterval = this.getRetryInterval();
    await waitForTimer(retryInterval);
  }

  private getRetryInterval(): number {
    const retryIntervalIndex = this.snapshotCounter - 1;
    const retryInterval = this.retryIntervals[retryIntervalIndex];
    return retryInterval ?? this.maxRetryInterval;
  }
}
