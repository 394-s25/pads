import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportForm from '../ReportForm';
import React from 'react';

//Firebase mock and test
vi.mock('../../apis/firebaseService', () => ({
  getAllEmergencyNames: vi.fn(() => Promise.resolve({ 0: 'Fire', 1: 'Medical' })),
  getIndexByEmergencyName: vi.fn((name) => Promise.resolve(name === 'Fire' ? '0' : '1')),
}));

// geolocaiton mock and test
vi.mock('../../utils/geoCoding', () => ({
  reverseGeocode: vi.fn(() => Promise.resolve('123 Main St, Springfield, IL')),
}));

// places autocomplete mock and test
vi.mock('../PlacesAutocomplete', () => ({
  default: ({ value, onChange, disabled }) => (
    <input
      data-testid="autocomplete"
      value={value}
      onChange={(e) =>
        onChange({ target: { name: 'location', value: e.target.value } })
      }
      disabled={disabled}
    />
  ),
}));

describe('ReportForm submission with full address', () => {
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
      isResolved: false,
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

  it('submits the full address selected from autocomplete', () => {
    render(
      <ReportForm
        formData={{ ...formData, location: '123 Main St, Springfield, IL' }}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submissionStatus={null}
      />
    );

    const autocomplete = screen.getByTestId('autocomplete');
    fireEvent.change(autocomplete, {
      target: { value: '123 Main St, Springfield, IL' },
    });

    const submitButton = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalled();
    expect(handleSubmit.mock.calls[0][0]).toMatchObject({
      location: '123 Main St, Springfield, IL',
    });
  });
});
