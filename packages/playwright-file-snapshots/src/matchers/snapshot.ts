import { performance } from "node:perf_hooks";

import { waitForTimer } from "../utils/timer";

interface Snapshot {
  getValue: () => unknown;
}

type RepeatableSnapshotValue = () => unknown;

export function createSnapshotInstance(
  value: unknown,
): StaticSnapshot | RepeatableSnapshot {
  if (isFunctionWithParameters(value)) {
    throw new Error(
      "Invalid snapshot value: only functions without parameters are supported.",
    );
  }

  if (isRepeatableSnapshotValue(value)) {
    return new RepeatableSnapshot(value);
  }

  return new StaticSnapshot(value);
}

function isFunctionWithParameters(value: unknown): boolean {
  return typeof value === "function" && value.length > 0;
}

function isRepeatableSnapshotValue(
  value: unknown,
): value is RepeatableSnapshotValue {
  return typeof value === "function" && value.length === 0;
}

export class StaticSnapshot implements Snapshot {
  private readonly value: unknown;

  public constructor(value: unknown) {
    this.value = value;
  }

  public getValue(): unknown {
    return this.value;
  }
}

export class RepeatableSnapshot implements Snapshot {
  private readonly maxRetryInterval = 1000;
  private readonly retryIntervals = [100, 250, 500];
  private readonly startTime = performance.now();
  private snapshotCounter = 0;
  private readonly snapshotValueFn: RepeatableSnapshotValue;

  public constructor(snapshotValueFn: RepeatableSnapshotValue) {
    this.snapshotValueFn = snapshotValueFn;
  }

  public async getValue(): Promise<unknown> {
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
