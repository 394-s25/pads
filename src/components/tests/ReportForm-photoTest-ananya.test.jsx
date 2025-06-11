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

describe('ReportForm photo upload', () => {
  let formData;
  let handleChange;
  let handleSubmit;

  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    
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

  it('uploads selected photos to database storage', () => {
    render(
      <ReportForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submissionStatus={null}
      />
    );

    const fileInput = screen.getByLabelText(/upload images or videos/i);
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const submitButton = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalled();
    expect(handleSubmit.mock.calls[0][1]).toEqual([mockFile]);
  });
});