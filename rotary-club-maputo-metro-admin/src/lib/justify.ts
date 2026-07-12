export type JustifiedBox<T> = { item: T; width: number; height: number };

export function computeJustifiedRows<T extends { width?: number | null; height?: number | null }>(
  items: T[],
  containerWidth: number,
  targetRowHeight = 220,
  gap = 8
): JustifiedBox<T>[][] {
  if (containerWidth <= 0) return [];

  const rows: JustifiedBox<T>[][] = [];
  let currentRow: { item: T; ratio: number }[] = [];
  let currentRowWidth = 0;

  const flush = (isLast: boolean) => {
    if (currentRow.length === 0) return;
    const totalGap = gap * (currentRow.length - 1);
    const availableWidth = containerWidth - totalGap;
    const scale =
      isLast && currentRowWidth < availableWidth * 0.6
        ? 1
        : availableWidth / currentRowWidth;
    const rowHeight = targetRowHeight * scale;
    rows.push(
      currentRow.map(({ item, ratio }) => ({
        item,
        width: ratio * rowHeight,
        height: rowHeight,
      }))
    );
    currentRow = [];
    currentRowWidth = 0;
  };

  for (const item of items) {
    const ratio = item.width && item.height ? item.width / item.height : 1.5;
    currentRow.push({ item, ratio });
    currentRowWidth += ratio * targetRowHeight;

    const totalGap = gap * (currentRow.length - 1);
    if (currentRowWidth + totalGap >= containerWidth) {
      flush(false);
    }
  }
  flush(true);

  return rows;
}
