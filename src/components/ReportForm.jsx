import React from "react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Location from "./location";
import { getAllEmergencyNames, getIndexByEmergencyName } from "../apis/firebaseService";
import { v4 as uuid } from "uuid";

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

//const ReportForm = ({ formData, handleChange, handleSubmit, submissionStatus }) => { ---
const ReportFormComponent = ({ formData, handleChange, handleSubmit, submissionStatus }, ref) => {    
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [useCurrentTime, setUseCurrentTime] = useState(false);
    const [time, setTime] = useState('');
    const [allEmergencies, setAllEmergencies] = useState([]); // strings
    const [emergencies, setEmergencies] = useState([]); // indices

    useImperativeHandle(ref, () => ({
        resetToggles() {
            setUseCurrentLocation(false);
            setUseCurrentTime(false);
        }
    }));

    const toggleLocation = () => {
        setUseCurrentLocation((prev) => !prev);
    };

    const toggleTime = () => {
        setUseCurrentTime((prev) => !prev);
    };

    const getCurrentTime = () => {
        var now = new Date();
        var datetime = now.toISOString();
        return datetime;
    };

    const formatReadableTime = (isoTime) => {
    const date = new Date(isoTime);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    return date.toLocaleString(undefined, options);
};

    useEffect(() => {
        const fetchEmergencies = async () => {
            const result = await getAllEmergencyNames(); // should return an object
            setAllEmergencies(Object.values(result));    // convert to array
        };

        fetchEmergencies();
    }, []);

    const emergencyHandler = async (emergency) => {
        const newIndex = await getIndexByEmergencyName(emergency);
        console.log(newIndex);
        if (emergencies.includes(newIndex)) {
            const newEmergencies = emergencies.filter((e) => e !== newIndex);
            setEmergencies(newEmergencies);
            handleChange({
                target: {
                    name: 'emergencies',
                    value: emergencies
                }})
        } else {
            setEmergencies((prev) => [...prev, newIndex]);
            handleChange({
                target: {
                    name: 'emergencies',
                    value: emergencies
                }})
        }
    };

    useEffect(() => {
        console.log("Emergencies updated:", emergencies);
    }, [emergencies]);

    useEffect(() => {
        if (useCurrentTime) {
            const current = getCurrentTime();
            setTime(formatReadableTime(current)); 
            handleChange({
                target: {
                    name: 'time',
                    value: current,
                },
            });
        }
    }, [useCurrentTime]);
    // location
    useEffect(() => {
        if (useCurrentLocation && "geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              handleChange({
                target: {
                  name: 'location',
                  value: `${latitude}, ${longitude}`
                }
              });
            },
            (error) => {
              console.error("Failed to get location:", error);
              handleChange({
                target: {
                  name: 'location',
                  value: "Location unavailable"
                }
              });
            }
          );
        }
      }, [useCurrentLocation]);
      
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-6 max-w-4xl">
                <header className="mb-8 border-b border-gray-300 pb-4">
                    <h1 className="text-3xl font-bold text-indigo-900">Reports</h1>
                    <div className="flex gap-4 mt-4">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-indigo-700 transition-colors border border-slate-100">Create Report</button>
                        <button className="bg-indigo-200 text-gray-700 px-4 py-2 rounded-full font-medium shadow-md hover:bg-gray-300 transition-colors border border-slate-100">Saved Drafts</button>
                        <button className="bg-indigo-200 text-gray-700 px-4 py-2 rounded-full font-medium shadow-md hover:bg-gray-300 transition-colors border border-slate-100">Report Status</button>
                    </div>
                </header>

                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create a New Report</h2>
                    <p className="text-gray-600 mb-6">Please fill out the form below to submit a new report.</p>

                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Location:*
                                <div className="flex items-center mt-1">
                                    <input 
                                        name="location" 
                                        value={formData.location} 
                                        onChange={handleChange} 
                                        disabled={useCurrentLocation} 
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex items-center mt-2">
                                    <input 
                                        type="checkbox" 
                                        id="location-checkbox"
                                        name="location-bool" 
                                        checked={useCurrentLocation} 
                                        onChange={toggleLocation}
                                        className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="location-checkbox" className="text-sm text-gray-600">
                                        Use my current location
                                    </label>
                                </div>
                            </label>
                            {useCurrentLocation && (
                                <div className="mt-2 bg-indigo-50 p-3 rounded-lg">
                                    <Location />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Time:*
                                <div className="flex items-center mt-1">
                                    <input 
                                        type="datetime-local" 
                                        name="time" 
                                        value={formData.time.slice(0, 16)}
                                        onChange={handleChange} 
                                        disabled={useCurrentTime}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                                    />
                                </div>
                                <div className="flex items-center mt-2">
                                    <input 
                                        type="checkbox" 
                                        id="time-checkbox"
                                        name="time-bool" 
                                        checked={useCurrentTime} 
                                        onChange={toggleTime}
                                        className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="time-checkbox" className="text-sm text-gray-600">
                                        Use current time
                                    </label>
                                </div>
                            </label>
                            {useCurrentTime && (
                                <div className="mt-2 bg-indigo-50 p-3 rounded-lg">
                                    <p className="font-medium text-indigo-800">The time recorded is:</p>
                                    <p className="text-gray-700">{time}</p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Emergencies:
                                <div className="flex flex-wrap gap-2 mt-2">
                                {allEmergencies.map((emergency, index) => {
                                    const isSelected = emergencies.includes(index.toString()); // emergency index as string
                                    return (
                                        <button
                                            type="button"
                                            key={uuid()}
                                            onClick={() => emergencyHandler(emergency)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border border-slate-100
                                                ${isSelected
                                                    ? 'bg-red-500 text-white border border-red-600 hover:bg-red-600'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-200 hover:text-black border border-indigo-600'}
                                            `}>
                                            {emergency}
                                        </button>
                                    );
                                })}
                                </div>
                            </label>
                        </div>


                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Number of people:
                                <input 
                                    name="numPeople" 
                                    value={formData.numPeople} 
                                    onChange={handleChange}
                                    type="number"
                                    min="0"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Appearance:
                                <textarea 
                                    name="appearance" 
                                    value={formData.appearance} 
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Notes:
                                <textarea 
                                    name="notes" 
                                    value={formData.notes} 
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Phone number:
                                <input 
                                    name="phoneNumber" 
                                    value={formData.phoneNumber} 
                                    onChange={handleChange}
                                    type="tel"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Email:
                                <input 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange}
                                    type="email"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700 font-medium mb-2">
                                Assigned Organization:
                                <select 
                                    name="assignedOrg" 
                                    value={formData.assignedOrg} 
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                                >
                                    <option value="PADS Lake County">PADS Lake County</option>
                                </select>
                            </label>
                        </div>

                        <div className="mt-6">
                            <button 
                                type="submit"
                                className="bg-indigo-900 text-white py-3 px-6 rounded-full font-medium shadow-md hover:bg-indigo-600 transition-colors w-full sm:w-auto border border-slate-100 active:bg-indigo-200 active:text-black"
                            >
                                Submit Report
                            </button>
                        </div>
                        {submissionStatus && (
                            <p className="mt-4 text-green-700 font-semibold">{submissionStatus}</p>
                        )}
                    </form>
                </section>
            </div>
        </div>
    );
};

const ReportForm = forwardRef(ReportFormComponent);
export default ReportForm;