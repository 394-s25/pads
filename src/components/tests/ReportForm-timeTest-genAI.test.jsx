// src/components/tests/ReportForm-timeTest-genAI.test.jsx
import React, { useState, useRef } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportForm from '../ReportForm';

/* ───────── mocks ───────── */
vi.mock('../apis/firebaseService', () => ({
  getAllEmergencyNames: vi.fn().mockResolvedValue({ 0: 'Fire', 1: 'Flood' }),
  getIndexByEmergencyName: vi.fn().mockResolvedValue('0')
}));
vi.mock('../utils/geoCoding', () => ({
  reverseGeocode: vi.fn().mockResolvedValue('123 Mock St.')
}));
global.URL.createObjectURL = vi.fn();

/* ───── helper ───── */
const renderReportForm = () => {
  const handleSubmit = vi.fn();

  const Wrapper = () => {
    const [formData, setFormData] = useState({
      location: '',
      time: '',
      numPeople: 0,
      appearance: '',
      notes: '',
      phoneNumber: '',
      email: '',
      assignedOrg: 'PADS Lake County'
    });
    const handleChange = ({ target: { name, value } }) =>
      setFormData((p) => ({ ...p, [name]: value }));

    return (
      <ReportForm
        ref={useRef(null)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submissionStatus={null}
      />
    );
  };

  // user-event drives Vitest’s mocked clock
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  return { user, handleSubmit, ...render(<Wrapper />) };
};

/* ───── tests ───── */
describe('ReportForm – time field behaviour', () => {
  const fixedNow = new Date('2025-06-10T23:15:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('uploads Chicago-adjusted current time when checkbox is checked', async () => {
    const { user, handleSubmit } = renderReportForm();

    await user.click(screen.getByLabelText(/Use current time/i));
    await user.click(screen.getByRole('button', { name: /submit report/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    const [data] = handleSubmit.mock.calls[0];
    const expected = new Date(fixedNow.getTime() - 5 * 3_600_000).toISOString();
    expect(data.time).toBe(expected);
  });

  it('uploads the manually typed datetime-local value unchanged', async () => {
    const { user, handleSubmit } = renderReportForm();

    const input  = screen.getByLabelText(/Time of Observance/i);
    const manual = '2025-12-01T09:30';

    await user.clear(input);
    await user.type(input, manual);

    await vi.runOnlyPendingTimersAsync(); // flush timeouts from user.type()
    await Promise.resolve();              // flush micro-tasks

    await user.click(screen.getByRole('button', { name: /submit report/i }));
    await vi.runOnlyPendingTimersAsync();

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    const [data] = handleSubmit.mock.calls[0];
    expect(data.time).toBe(manual);
  });
});
