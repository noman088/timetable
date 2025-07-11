import React, { useState } from "react";

const ScheduleManager = () => {
    const [selectDay, setSelectDay] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [editItem, setEditItem] = useState(null);
    // =========================================================================================
    // handle function for saving the data in database
    const handleSaveAllToDB = async () => {
        const dataToSave = schedules.filter((item) => item.day === selectDay);
        if (dataToSave.length === 0) {
            alert("No data to save for the selected day.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/schedules",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSave),
                }
            );

            if (response.ok) {
                alert(" saved successfully!");
            } else {
                alert(" Failed to save .");
            }
        } catch (error) {
            console.error("Error saving schedules:", error);
            alert("Something went wrong.");
        }
    };
    /////////////////////////////////////////////////////////////////////////////////////////////
    const formatTime = (time) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    const handleSubmit = (data) => {
        setSchedules((prev) => {
            const exists = prev.find((item) => item.id === data.id);
            if (exists) {
                return prev.map((item) => (item.id === data.id ? data : item));
            }
            return [...prev, data];
        });
        setShowPopup(false);
        setEditItem(null);
    };

    const PeriodPopup = ({ onClose, onSubmit, initialData = {} }) => {
        const [subject, setSubject] = useState(initialData.subject || "");
        const [timeFrom, setTimeFrom] = useState(initialData.timeFrom || "");
        const [timeTill, setTimeTill] = useState(initialData.timeTill || "");

        const handleSubmit = () => {
            if (subject && timeFrom && timeTill) {
                onSubmit({
                    id: initialData.id || Date.now(),
                    type: "period",
                    subject,
                    timeFrom,
                    timeTill,
                    day: selectDay,
                });
                onClose();
            }
        };

        return (
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm mx-auto">
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter the subject"
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="text-sm font-medium">From:</label>
                <input
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mb-4">
                    {timeFrom && `Selected: ${formatTime(timeFrom)}`}
                </p>
                <label className="text-sm font-medium">Till:</label>
                <input
                    type="time"
                    value={timeTill}
                    onChange={(e) => setTimeTill(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mb-4">
                    {timeTill && `Selected: ${formatTime(timeTill)}`}
                </p>
                <div className="flex justify-end mt-2 gap-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                        {initialData.id ? "Update" : "Submit"}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-1 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    const IntervalPopup = ({ onClose, onSubmit, initialData = {} }) => {
        const [intervalType, setIntervalType] = useState(
            initialData.subject || ""
        );
        const [timeFrom, setTimeFrom] = useState(initialData.timeFrom || "");
        const [timeTill, setTimeTill] = useState(initialData.timeTill || "");

        const handleSubmit = () => {
            if (intervalType && timeFrom && timeTill) {
                onSubmit({
                    id: initialData.id || Date.now(),
                    type: "interval",
                    subject: intervalType,
                    timeFrom,
                    timeTill,
                    day: selectDay,
                });
                onClose();
            }
        };

        return (
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm mx-auto">
                <select
                    value={intervalType}
                    onChange={(e) => setIntervalType(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="">Choose Interval Type</option>
                    <option value="Morning Break">Morning Break</option>
                    <option value="Afternoon Break">Afternoon Break</option>
                    <option value="Evening Break">Evening Break</option>
                </select>
                <label className="text-sm font-medium">From:</label>
                <input
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mb-4">
                    {timeFrom && `Selected: ${formatTime(timeFrom)}`}
                </p>
                <label className="text-sm font-medium">Till:</label>
                <input
                    type="time"
                    value={timeTill}
                    onChange={(e) => setTimeTill(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mb-4">
                    {timeTill && `Selected: ${formatTime(timeTill)}`}
                </p>
                <div className="flex justify-end mt-2 gap-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                        {initialData.id ? "Update" : "Submit"}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-1 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    const DayDropdown = ({ selectedDay, setSelectDay }) => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-purple-500 text-white px-4 py-2 rounded w-full mb-2"
                >
                    {selectedDay || "Choose the day"}
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full bg-white border rounded shadow">
                        {days.map((day) => (
                            <div
                                key={day}
                                onClick={() => {
                                    setSelectDay(day);
                                    setIsOpen(false);
                                }}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const ScheduleTable = () => {
        const filtered = schedules.filter((item) => item.day === selectDay);
        return (
            <div className="bg-white mt-6 p-4 rounded shadow w-full overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Scheduled Items</h3>
                <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="bg-purple-200 text-left">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">From</th>
                            <th className="border p-2">To</th>
                            <th className="border p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border p-2">{item.subject}</td>
                                <td className="border p-2">
                                    {formatTime(item.timeFrom)}
                                </td>
                                <td className="border p-2">
                                    {formatTime(item.timeTill)}
                                </td>
                                <td className="border p-2 flex gap-2 justify-center">
                                    <button
                                        onClick={() => {
                                            setEditItem(item);
                                            setPopupType(item.type);
                                            setShowPopup(true);
                                        }}
                                        className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSchedules((prev) =>
                                                prev.filter(
                                                    (entry) =>
                                                        entry.id !== item.id
                                                )
                                            );
                                        }}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center text-gray-500 p-4"
                                >
                                    No schedule added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-6 w-full max-w-6xl mx-auto border-2">
            <h1 className="text-4xl text-blue-800 text-center mb-4 border-b pb-2  shadow-gray-300 shadow-2xl">
                WELCOME TO TIME TABLE
            </h1>
            <div className="flex flex-col md:flex-row gap-6 min-h-[400px] ">
                <div className="md:w-1/2 w-full bg-white p-6 rounded  shadow-gray-300 shadow-2xl">
                    <DayDropdown
                        selectedDay={selectDay}
                        setSelectDay={setSelectDay}
                    />
                    <button
                        onClick={() => {
                            setPopupType("period");
                            setEditItem(null);
                            setShowPopup(true);
                        }}
                        className="bg-purple-500 text-white px-4 py-2 rounded w-full mt-2"
                    >
                        Select the period
                    </button>
                    <button
                        onClick={() => {
                            setPopupType("interval");
                            setEditItem(null);
                            setShowPopup(true);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2"
                    >
                        Select interval
                    </button>
                </div>
                <div className="md:w-1/2 w-full">
                    {showPopup && popupType === "period" && (
                        <PeriodPopup
                            onClose={() => {
                                setShowPopup(false);
                                setEditItem(null);
                            }}
                            onSubmit={handleSubmit}
                            initialData={editItem || {}}
                        />
                    )}
                    {showPopup && popupType === "interval" && (
                        <IntervalPopup
                            onClose={() => {
                                setShowPopup(false);
                                setEditItem(null);
                            }}
                            onSubmit={handleSubmit}
                            initialData={editItem || {}}
                        />
                    )}
                </div>
            </div>

            <ScheduleTable />
            <div className="mt-10 flex justify-center">
                <button
                    onClick={handleSaveAllToDB}
                    disabled={
                        schedules.filter((item) => item.day === selectDay)
                            .length === 0
                    }
                    className={`px-6 py-3 text-lg rounded shadow-md transition duration-300
            ${
                schedules.filter((item) => item.day === selectDay).length === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
            }`}
                >
                    Save All to Database
                </button>
            </div>
        </div>
    );
};

export default ScheduleManager;
