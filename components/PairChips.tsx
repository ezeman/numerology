import clsx from 'clsx';

export default function PairChips({
  pairs,
}: {
  pairs: { pair: string; score: number; meaning?: { th?: string; en?: string } }[];
}) {
  return (
    <div className="overflow-x-auto whitespace-nowrap py-2">
      {pairs.map((p, i) => (
        <span
          key={`${p.pair}-${i}`}
          title={`${p.meaning?.th || p.meaning?.en || ''}`}
          className={clsx(
            'inline-block mr-2 mb-2 rounded-full px-3 py-1 text-sm border',
            p.score > 0 ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-200' :
            p.score < 0 ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-200' :
            'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900/40 dark:border-gray-700 dark:text-gray-200'
          )}
        >
          {p.pair}
        </span>
      ))}
    </div>
  );
}

