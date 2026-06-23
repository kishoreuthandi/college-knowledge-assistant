export default function SourceList({ sources }) {
  if (!sources?.length) return null;
  return (
    <div className="mt-3 space-y-2">
      {sources.map((source, index) => (
        <div key={`${source.document_id}-${source.chunk_index}-${index}`} className="rounded border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
            <span>{source.filename}</span>
            <span className="rounded bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {source.module} · {Math.round(source.score * 100)}%
            </span>
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{source.preview}</p>
        </div>
      ))}
    </div>
  );
}
