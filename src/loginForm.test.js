import { describe, expect, test, mock } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { validateLoginForm, submitLoginForm, LoginForm } from './loginForm.jsx';

describe('login form behavior', () => {
  test('flags validation errors for missing credentials', () => {
    const errors = validateLoginForm({ username: '', password: '' });
    expect(errors.username).toBe('Email is required');
    expect(errors.password).toBe('PIN / password is required');
  });

  test('submits when form is valid', async () => {
    const login = mock(async () => {});
    const setErrors = mock(() => {});

    const ok = await submitLoginForm({
      loginForm: { username: 'member@example.com', password: '1234' },
      setValidationErrors: setErrors,
      login
    });

    expect(ok).toBe(true);
    expect(setErrors).toHaveBeenCalledWith({});
    expect(login).toHaveBeenCalledTimes(1);
  });

  test('does not submit when invalid', async () => {
    const login = mock(async () => {});
    const setErrors = mock(() => {});

    const ok = await submitLoginForm({
      loginForm: { username: '', password: '' },
      setValidationErrors: setErrors,
      login
    });

    expect(ok).toBe(false);
    expect(login).toHaveBeenCalledTimes(0);
  });

  test('renders as a proper form with required fields and submit button', () => {
    const html = renderToStaticMarkup(createElement(LoginForm, {
      config: { baseUrl: '', companyUuid: '' },
      setConfig: () => {},
      loginForm: { username: '', password: '' },
      setLoginForm: () => {},
      login: () => {},
      status: { loading: false, error: '' }
    }));

    expect(html).toContain('<form');
    expect(html).toContain('type="email"');
    expect(html).toContain('required=""');
    expect(html).toContain('type="submit"');
  });
});
