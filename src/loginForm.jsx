import { useState } from 'react';

export function validateLoginForm(loginForm = {}) {
  const errors = {};
  if (!loginForm.username?.trim()) errors.username = 'Email is required';
  if (!loginForm.password?.trim()) errors.password = 'PIN / password is required';
  return errors;
}

export async function submitLoginForm({ loginForm, setValidationErrors, login }) {
  const errors = validateLoginForm(loginForm);
  setValidationErrors(errors);
  if (Object.keys(errors).length > 0) return false;
  await login();
  return true;
}

export function LoginForm({ config, setConfig, loginForm, setLoginForm, login, status }) {
  const [validationErrors, setValidationErrors] = useState({});

  const onSubmit = async (event) => {
    event.preventDefault();
    await submitLoginForm({ loginForm, setValidationErrors, login });
  };

  return (
    <form className="mt-4 space-y-3" onSubmit={onSubmit} noValidate>
      <input placeholder="Base URL" value={config.baseUrl} onChange={(event) => setConfig((c) => ({ ...c, baseUrl: event.target.value }))} />
      <input placeholder="Company UUID" value={config.companyUuid} onChange={(event) => setConfig((c) => ({ ...c, companyUuid: event.target.value }))} />

      <div>
        <input
          placeholder="Email"
          type="email"
          required
          value={loginForm.username}
          onChange={(event) => setLoginForm((f) => ({ ...f, username: event.target.value }))}
        />
        {validationErrors.username && <p className="mt-1 text-xs text-rose-400">{validationErrors.username}</p>}
      </div>

      <div>
        <input
          placeholder="PIN / password"
          type="password"
          required
          value={loginForm.password}
          onChange={(event) => setLoginForm((f) => ({ ...f, password: event.target.value }))}
        />
        {validationErrors.password && <p className="mt-1 text-xs text-rose-400">{validationErrors.password}</p>}
      </div>

      <button className="w-full bg-cyan-600 text-white" type="submit" disabled={status.loading}>Sign in</button>
      {status.error && <p className="text-xs text-rose-400">{status.error}</p>}
    </form>
  );
}
