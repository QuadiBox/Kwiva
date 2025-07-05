'use client'
import { useEffect, useState, useRef } from "react";
import { db } from "@/app/db/FirebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

const Challenge = () => {
    const [formData, setFormData] = useState({
        title: "",
        type: "challenge",
        start_date: Date.now(),
        end_date: Date.now(),
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const validate = () => {
        if (!formData.start_date.trim()) return "Start Date is required.";
        if (!formData.end_date.trim()) return "End Date is required.";
        return null;
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const resetForm = () => {
        setFormData((prev) => ({
            ...prev,
            start_date: Date.now(),
            title: "",
            end_date: Date.now(),
        }));
    };



    return (
        <section className='unitFunctionSect'>
            <h2>Create New Challenge</h2>
            <form className="textEditorForm challengeEdition">
                    <div className="UnitInputCntn">
                        <label className="block font-semibold">Title:</label>
                        <input
                            value={formData.title}
                            type="text"
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="w-full p-2 border rounded"
                            maxLength={160}
                            placeholder="Enter title"
                        />
                    </div>

                    <div className="dualInputCntn">
                        <div className="UnitInputCntn">
                            <label className="block font-semibold">Start Date:</label>
                            <input
                                value={formData.start_date}
                                type="datetime-local"
                                onChange={(e) => handleChange("start_date", e.target.value)}
                                className="w-full p-2 border rounded"
                                maxLength={160}
                                placeholder="Enter start date"
                            />
                        </div>
                        <div className="UnitInputCntn">
                            <label className="block font-semibold">End Date:</label>
                            <input
                                value={formData.end_date}
                                type="datetime-local"
                                onChange={(e) => handleChange("end_date", e.target.value)}
                                className="w-full p-2 border rounded"
                                maxLength={160}
                                placeholder="Enter end date"
                            />
                        </div>
                    </div>

                    {message.text && (
                        <div
                            ref={messageRef}
                            className={`textEditorMsg ${
                            message.type === "error" ? "error" : "msg"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="textEditorSubmitBtn">
                        {loading ? "Creating..." : "Create Challenge"}
                    </button>
            </form>
        </section>
    )
}

export default Challenge
