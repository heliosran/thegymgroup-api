import { useState } from 'react';

export default function EndpointRunner({ endpoint, onRun }) {
  const fields = [...(endpoint.pathParams || []), ...(endpoint.query || []), ...(endpoint.form || []), ...(endpoint.json || [])];
  const [values, setValues] = useState({});

  return (
    <details className="rounded-xl border border-slate-700 bg-slate-950/50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-cyan-300">
        <span className="mr-2 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px]">{endpoint.method}</span>
        {endpoint.path}
      </summary>
      <div className="mt-3 space-y-2">
        {fields.length === 0 && <p className="text-xs text-slate-400">No parameters required.</p>}
        {fields.map((field) => (
          <label key={field} className="block text-xs text-slate-300">
            {field}
            <input
              className="mt-1"
              placeholder={field}
              value={values[field] || ''}
              onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))}
            />
          </label>
        ))}
        <button className="bg-cyan-600 text-white" onClick={() => onRun(endpoint.key, values)}>
          Run endpoint
        </button>
      </div>
    </details>
  );
}
