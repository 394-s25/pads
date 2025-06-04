import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportForm from '../ReportForm';
import React from 'react';

// Mock Firebase and Geocoding
vi.mock('../apis/firebaseService', () => ({
  getAllEmergencyNames: vi.fn(() => Promise.resolve({ 0: 'Fire', 1: 'Medical' })),
  getIndexByEmergencyName: vi.fn((name) => Promise.resolve(name === 'Fire' ? '0' : '1')),
}));

vi.mock('../utils/geoCoding', () => ({
  reverseGeocode: vi.fn(() => Promise.resolve('123 Main St, Springfield, IL')),
}));

// Mock PlacesAutocomplete to behave like a basic input
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

describe('ReportForm autocomplete behavior', () => {
  let mockHandleChange;
  let mockHandleSubmit;
  let formData;

  beforeEach(() => {
    mockHandleChange = vi.fn();
    mockHandleSubmit = vi.fn();
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

  it('should update location with full address from autocomplete input', async () => {
    render(
      <ReportForm
        formData={formData}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        submissionStatus={null}
      />
    );

    const autocompleteInput = screen.getByTestId('autocomplete');
    fireEvent.change(autocompleteInput, {
      target: { value: '123 Main St, Springfield, IL' },
    });

    expect(mockHandleChange).toHaveBeenCalledWith({
      target: {
        name: 'location',
        value: '123 Main St, Springfield, IL',
      },
    });
  });
});
