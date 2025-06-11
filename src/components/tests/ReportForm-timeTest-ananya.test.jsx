import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportForm from '../ReportForm';
import React from 'react';

vi.mock('../../apis/firebaseService', () => ({
  getAllEmergencyNames: vi.fn(() => Promise.resolve({ 0: 'Fire' })),
  getIndexByEmergencyName: vi.fn(() => Promise.resolve('0')),
}));

vi.mock('../PlacesAutocomplete', () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid="autocomplete"
      value={value}
      onChange={(e) => onChange({ target: { name: 'location', value: e.target.value } })}
    />
  ),
}));

describe('ReportForm manual time input', () => {
  let formData;
  let handleChange;
  let handleSubmit;

  beforeEach(() => {
    handleChange = vi.fn();
    handleSubmit = vi.fn();
    formData = {
      location: '',
      time: '',
      numPeople: 0,
      emergencies: '',
      notes: '',
      phoneNumber: '',
      email: '',
      appearance: '',
      assignedOrg: 'PADS Lake County',
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('uploads manually entered time to database', () => {
    render(
      <ReportForm
        formData={{ ...formData, time: '2024-12-15T14:30' }}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submissionStatus={null}
      />
    );

    const timeInput = screen.getByDisplayValue('2024-12-15T14:30');
    fireEvent.change(timeInput, { target: { value: '2024-12-16T10:15' } });

    const submitButton = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalled();
    expect(handleSubmit.mock.calls[0][0]).toMatchObject({
      time: '2024-12-15T14:30',
    });
  });
});