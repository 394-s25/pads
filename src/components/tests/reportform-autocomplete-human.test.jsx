import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportForm from '../ReportForm';
import React from 'react';

// fake the API calls
vi.mock('../apis/firebaseService', () => ({
  getAllEmergencyNames: vi.fn(() => Promise.resolve({ 0: 'Fire', 1: 'Medical' })),
  getIndexByEmergencyName: vi.fn((name) => Promise.resolve(name === 'Fire' ? '0' : '1')),
}));

vi.mock('../utils/geoCoding', () => ({
  reverseGeocode: vi.fn(() => Promise.resolve('123 Main St, Springfield, IL')),
}));

// regular input for testing
vi.mock('../PlacesAutocomplete', () => ({
  default: ({ value, onChange, disabled }) => (
    <input
      data-testid="location-input"
      value={value}
      onChange={(e) =>
        onChange({ target: { name: 'location', value: e.target.value } })
      }
      disabled={disabled}
    />
  ),
}));

describe('ReportForm - autocomplete input', () => {
  let changeFn;
  let submitFn;
  let initialData;

  beforeEach(() => {
    changeFn = vi.fn();
    submitFn = vi.fn();

    initialData = {
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

  it('updates formData.location when user types an address in autocomplete field', () => {
    render(
      <ReportForm
        formData={initialData}
        handleChange={changeFn}
        handleSubmit={submitFn}
        submissionStatus={null}
      />
    );

    const locationInput = screen.getByTestId('location-input');

    // simulate user typing
    fireEvent.change(locationInput, {
      target: { value: '123 Main St, Springfield, IL' },
    });

    // make changeFn called with the correct data
    expect(changeFn).toHaveBeenCalledWith({
      target: {
        name: 'location',
        value: '123 Main St, Springfield, IL',
      },
    });
  });
});
