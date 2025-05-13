import React from "react";
import { useState } from "react";

// location: '', // get current location from map
// time: '', // enter manually with a time input box or select use current time
// numPeople: 0, // counter with a [- value +], doesn't go below 0, value can also be changed to a number by typing it
// emergencies: '', // selectable buttons, optional
// isResolved: false, // not visible
// notes: '', // larger box
// phoneNumber: '', // optional
// email: '', // optional
// appearance: '', // larger box
// assignedOrg: 'PADS Lake County' // dropdown with only one option as of now

const ReportForm = (formData, handleChange, handleSubmit) => {
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1>Reports</h1>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button>Create Report</button>
                <button>Saved Drafts</button>
                <button>Report Status</button>
                </div>
            </header>

            <section>
                <h2>Create a New Report</h2>
                <p>Please fill out the form below to submit a new report.</p>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                <label>
                    Location:
                    <input name="location" value={formData.location} onChange={handleChange} />
                </label>

                <label>
                    Time:
                    <input name="time" value={formData.time} onChange={handleChange} />
                </label>

                <label>
                    Emergencies:
                    <input name="emergencies" value={formData.emergencies} onChange={handleChange} />
                </label>

                <label>
                    Number of people:
                    <input name="numPeople" value={formData.numPeople} onChange={handleChange} />
                </label>

                <label>
                    Appearance:
                    <input name="appearance" value={formData.appearance} onChange={handleChange} />
                </label>

                <label>
                    Notes:
                    <input name="notes" value={formData.notes} onChange={handleChange} />
                </label>

                <label>
                    Phone number:
                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </label>

                <label>
                    Email:
                    <input name="email" value={formData.email} onChange={handleChange} />
                </label>

                <label>
                    Assigned Organization:
                    <input name="assignedOrg" value={formData.assignedOrg} onChange={handleChange} />
                </label>

                <button type="submit" style={{ marginTop: '1rem' }}>Submit Report</button>
                </form>
            </section>
        </div>
    );
};

export default ReportForm;