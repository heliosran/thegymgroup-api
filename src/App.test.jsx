import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

function queueFetch(responses) {
  const mock = vi.fn();
  responses.forEach((body) => {
    mock.mockResolvedValueOnce({ ok: true, status: 200, text: async () => JSON.stringify(body) });
  });
  vi.stubGlobal('fetch', mock);
  return mock;
}

async function login(user) {
  await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
  await user.type(screen.getByPlaceholderText('PIN / password'), '1234');
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  await screen.findByText('Welcome back,');
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('router gym app', () => {
  it('routes to login first then dashboard after sign-in', async () => {
    queueFetch([
      { sessionId: 's1', uuid: 'u1', firstName: 'Sam', homeClubUuid: 'club1' },
      { gymLocationName: 'Acton', currentPercentage: 22 },
      [{ brief: { id: 'c1', name: 'Spin' } }],
      { checkIns: [] }
    ]);
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('Gym App Clone')).toBeInTheDocument();
    await login(user);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('navigates across mapped screens', async () => {
    queueFetch([
      { sessionId: 's1', uuid: 'u1', firstName: 'Sam', homeClubUuid: 'club1' },
      { gymLocationName: 'Acton', currentPercentage: 22 },
      [{ brief: { id: 'c1', name: 'Spin' } }],
      { checkIns: [] }
    ]);
    const user = userEvent.setup();
    render(<App />);
    await login(user);

    await user.click(screen.getByRole('link', { name: 'Classes' }));
    expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Schedule' }));
    expect(screen.getByRole('heading', { name: 'My Schedule' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Progress' }));
    expect(screen.getByRole('heading', { name: 'Progress' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Profile' }));
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Membership' }));
    expect(screen.getByRole('heading', { name: 'Membership' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Challenges' }));
    expect(screen.getByRole('heading', { name: 'Challenges' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'API Tools' }));
    expect(screen.getByRole('heading', { name: 'API Explorer' })).toBeInTheDocument();
  });

  it('runs class booking workflow from classes screen', async () => {
    const mock = queueFetch([
      { sessionId: 's1', uuid: 'u1', firstName: 'Sam', homeClubUuid: 'club1' },
      { gymLocationName: 'Acton', currentPercentage: 22 },
      [{ brief: { id: 'c1', name: 'Spin' } }],
      { checkIns: [] },
      [{
        brief: {
          id: 'class-1',
          name: 'Box Fit',
          startDateTime: 1773050400000,
          endDateTime: 1773052200000,
          maxCapacity: 6,
          totalBooked: 2,
          waitlistCapacity: 5,
          waitlistBooked: 1,
          booked: true,
          waitlisted: false,
          cancelled: false,
          type: null,
          clubUuid: 'club1',
          instructor: { fullName: '' },
          activity: { description: 'Strength session' },
          customInfo: [{ key: 'offPeakHours', value: 'true' }]
        },
        details: { cancellationWindowEnd: 1773050400000 },
        attendeeDetails: { productAvailability: 'NOT_APPLICABLE', availableActions: ['REMOVE_FROM_CLASS'] }
      }],
      { ok: true },
      [{ brief: { id: 'class-1', name: 'Box Fit' } }],
      [{ brief: { id: 'class-1', name: 'Box Fit' } }]
    ]);
    const user = userEvent.setup();
    render(<App />);
    await login(user);

    await user.click(screen.getByRole('link', { name: 'Classes' }));
    await user.click(screen.getByRole('button', { name: 'Find classes' }));
    expect(await screen.findByText('Box Fit')).toBeInTheDocument();
    expect(screen.getByText(/Booked:/)).toBeInTheDocument();
    expect(screen.getByText(/Available:/)).toBeInTheDocument();
    expect(screen.getByText(/Cancel before:/)).toBeInTheDocument();
    expect(screen.getByText(/offPeakHours: true/)).toBeInTheDocument();
    expect(screen.getAllByText(/Strength session/).length).toBeGreaterThan(0);

    await user.click(await screen.findByRole('button', { name: 'Book' }));
    expect(mock).toHaveBeenCalled();
  });


  it('uses class clubUuid as companyUuid for booking actions when config company UUID is empty', async () => {
    const mock = queueFetch([
      { sessionId: 's1', uuid: 'u1', firstName: 'Sam', homeClubUuid: 'club1' },
      { gymLocationName: 'Acton', currentPercentage: 22 },
      [{ brief: { id: 'c1', name: 'Spin' } }],
      { checkIns: [] },
      [{
        brief: {
          id: 'class-1',
          name: 'Box Fit',
          clubUuid: '58cf98f7-68e3-4371-9e22-3ca14842b5e9'
        },
        details: {},
        attendeeDetails: {}
      }],
      { ok: true },
      [{ brief: { id: 'class-1', name: 'Box Fit' } }],
      [{ brief: { id: 'class-1', name: 'Box Fit' } }]
    ]);

    const user = userEvent.setup();
    render(<App />);
    await login(user);

    await user.click(screen.getByRole('link', { name: 'Classes' }));
    await user.click(screen.getByRole('button', { name: 'Find classes' }));
    await user.click(await screen.findByRole('button', { name: 'Book' }));

    const bookingCall = mock.mock.calls.find(([url, options]) =>
      String(url).includes('/addExerciser') && options?.method === 'POST'
    );
    expect(bookingCall).toBeTruthy();
    expect(bookingCall[0]).toContain('/np/company/58cf98f7-68e3-4371-9e22-3ca14842b5e9/class/class-1/addExerciser');
  });

  it('loads and saves profile from profile screen', async () => {
    queueFetch([
      { sessionId: 's1', uuid: 'u1', firstName: 'Sam', homeClubUuid: 'club1' },
      { gymLocationName: 'Acton', currentPercentage: 22 },
      [{ brief: { id: 'c1', name: 'Spin' } }],
      { checkIns: [] },
      { firstName: 'Sam' },
      { ok: true }
    ]);
    const user = userEvent.setup();
    render(<App />);
    await login(user);

    await user.click(screen.getByRole('link', { name: 'Profile' }));
    await user.click(screen.getByRole('button', { name: 'Load profile' }));
    const input = (await screen.findAllByPlaceholderText('firstName'))[0];
    await user.clear(input);
    await user.type(input, 'Samantha');
    await user.click(screen.getByRole('button', { name: 'Save profile' }));
    expect(screen.getByDisplayValue('Samantha')).toBeInTheDocument();
  });
});
