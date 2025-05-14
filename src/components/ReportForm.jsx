import React from "react";
import { useState, useEffect } from "react";
import Location from "./location";
import { getAllEmergencyNames } from "../apis/firebaseService";

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

const ReportForm = ({ formData, handleChange, handleSubmit }) => {
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [useCurrentTime, setUseCurrentTime] = useState(false);
    const [time, setTime] = useState('');
    // console.log(getAllEmergencyNames());

    const toggleLocation = () => {
        setUseCurrentLocation((prev) => !prev);
    };

    const toggleTime = () => {
        setUseCurrentTime((prev) => !prev);
    };

    const getCurrentTime = () => {
        var now = new Date();
        var datetime = now.toTimeString();
        return datetime;
    };

    useEffect(() => {
        if (useCurrentTime) {
            const current = getCurrentTime();
            setTime(current);
            handleChange({
                target: {
                  name: 'time',
                  value: current
                }})
            console.log(current);
        }
    }, [useCurrentTime]);
    
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
                    Location:*
                    <input name="location" value={formData.location} onChange={handleChange} disabled={useCurrentLocation} required className="border"/>
                    <input type="checkbox" name="location-bool" checked={useCurrentLocation} onChange={toggleLocation} />
                    Use my current location
                </label>
                {useCurrentLocation && (
                    <Location />
                )}

                <label>
                    Time:*
                    <input type="time" name="time" value={formData.time} onChange={handleChange} disabled={useCurrentTime} required className="border"/>
                    <input type="checkbox" name="time-bool" checked={useCurrentTime} onChange={toggleTime} />
                    Use current time
                </label>
                {useCurrentTime && (
                    <div>
                        <h1>The time recorded is:</h1>
                        <p>{time}</p>
                    </div>
                )}

                <label>
                    Emergencies:
                    <input name="emergencies" value={formData.emergencies} onChange={handleChange} className="border" />
                </label>

                <label>
                    Number of people:
                    <input name="numPeople" value={formData.numPeople} onChange={handleChange} className="border" />
                </label>

                <label>
                    Appearance:
                    <input name="appearance" value={formData.appearance} onChange={handleChange} className="border" />
                </label>

                <label>
                    Notes:
                    <input name="notes" value={formData.notes} onChange={handleChange} className="border" />
                </label>

                <label>
                    Phone number:
                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="border" />
                </label>

                <label>
                    Email:
                    <input name="email" value={formData.email} onChange={handleChange} className="border" />
                </label>

                <label>
                    Assigned Organization:
                    <input name="assignedOrg" value={formData.assignedOrg} onChange={handleChange} className="border" />
                </label>

                <button type="submit" style={{ marginTop: '1rem' }} className="border">Submit Report</button>
                </form>
            </section>
        </div>
    );
};

export default ReportForm;