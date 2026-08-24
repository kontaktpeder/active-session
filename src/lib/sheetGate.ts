let dismissLockCount = 0;

export function isSheetDismissLocked(): boolean {
  return dismissLockCount > 0;
}

export function lockSheetDismiss(): void {
  dismissLockCount += 1;
}

export function unlockSheetDismiss(): void {
  dismissLockCount = Math.max(0, dismissLockCount - 1);
}

export function tryOpenSheet(open: () => void): boolean {
  if (isSheetDismissLocked()) return false;
  open();
  return true;
}
