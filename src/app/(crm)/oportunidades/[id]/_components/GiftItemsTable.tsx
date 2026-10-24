import { formatCurrencyWithCents, formatQuantity } from "@/utils/format";
import { EMPTY_VALUE } from "@/utils/labels";
import type { GiftItemsTableProps } from "../_types/detail";
import { getItemTotal } from "../_utils/detail";

export const GiftItemsTable = ({ items }: GiftItemsTableProps) => {
  if (items.length === 0) return <p className="px-4 pb-4 text-sm text-ink-soft">Nenhum item de brinde.</p>;

  const renderMoney = (value: number | null) =>
    value === null ? <span className="text-ink-soft">{EMPTY_VALUE}</span> : formatCurrencyWithCents(value);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="label text-ink-soft">
          <th scope="col" className="px-4 py-1.5 text-left font-medium">
            Brinde
          </th>
          <th scope="col" className="px-2 py-1.5 text-right font-medium">
            Qtd.
          </th>
          <th scope="col" className="px-2 py-1.5 text-right font-medium">
            Valor un.
          </th>
          <th scope="col" className="px-4 py-1.5 text-right font-medium">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-1.5">{item.description}</td>
            <td className="px-2 py-1.5 text-right font-mono">{formatQuantity(item.quantity)}</td>
            <td className="px-2 py-1.5 text-right font-mono">{renderMoney(item.unitValue)}</td>
            <td className="px-4 py-1.5 text-right font-mono font-bold">{renderMoney(getItemTotal(item))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
