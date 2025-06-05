"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, notFound } from "next/navigation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "@/app/db/FirebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    updateDoc,
} from "firebase/firestore";

export default function EditStoryPage({ cId }) {
    const contentId = cId;
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        previewText: "",
        mainContent: "",
        contentId: "",
        type: "story",
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        prevStory: { title: "", s_id: "", subtitle: "" },
        nextStory: { title: "", s_id: "", subtitle: "" },
        contentImage: "",
        tags: [],
        summaryDocId: "",
    });

    const [docId, setDocId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const messageRef = useRef(null);

    useEffect(() => {
        const fetchStory = async () => {
            if (!contentId) {
                router.push("/404");
                return;
            }

            try {
                const q = query(
                    collection(db, "blogs"),
                    where("contentId", "==", contentId)
                );
                const snap = await getDocs(q);

                const docSnap = snap.docs[0];
                if (!docSnap) {
                    router.push("/404");
                    return;
                }
                const storyDocId = docSnap.id;
                const data = docSnap.data();

                setDocId(storyDocId);
                setFormData({
                    ...data,
                    createdAt: data.createdAt,
                    lastUpdated: Date.now(),
                });
            } catch (err) {
                console.error("Error fetching story:", err);
                setMessage({ type: "error", text: "Failed to fetch story details." });
            }
        };

        fetchStory();
    }, [contentId]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const validate = () => {
        if (!formData.title.trim()) return "Title is required.";
        if (!formData.subtitle.trim()) return "Subtitle is required.";
        if (!formData.previewText.trim()) return "Preview text is required.";
        if (!formData.mainContent.trim()) return "Main content is required.";
        return null;
    };

    const refreshTimestamp = () => {
        setFormData((prev) => ({ ...prev, lastUpdated: Date.now() }));
    };

    const updateSummaryInbloglist = async () => {
        if (!formData?.summaryDocId || !formData?.contentId) {
            console.warn(
                "Missing summaryDocId or contentId. Skipping bloglist update."
            );
            return;
        }

        const summaryRef = doc(db, "bloglist", formData.summaryDocId);
        const snap = await getDoc(summaryRef);

        if (!snap.exists()) {
            console.error(`Summary doc ${formData.summaryDocId} does not exist.`);
            return;
        }

        const existingArticles = snap.data().articles || [];

        // Build the updated summary
        const updatedSummary = {
            id: formData?.contentId,
            title: formData?.title,
            subtitle: formData?.subtitle,
            previewText: formData?.previewText,
            tags: formData?.tags,
            summaryImage: formData?.contentImage,
            createdAt: formData?.createdAt,
        };

        // Replace the matching summary by contentId
        const updatedArticles = existingArticles.map((article) =>
            article.id === formData.contentId ? updatedSummary : article
        );

        await updateDoc(summaryRef, {
            articles: updatedArticles,
        });

        console.log(`✅ Summary updated in ${formData.summaryDocId}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        const error = validate();
        if (error) {
            setMessage({ type: "error", text: error });
            messageRef.current?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        if (!docId) {
            setMessage({ type: "error", text: "Document not ready for update." });
            return;
        }

        try {
            setLoading(true);

            const storyRef = doc(db, "blogs", docId);

            await updateDoc(storyRef, {
                ...formData,
                lastUpdated: Date.now(),
            });

            await updateSummaryInbloglist();

            setMessage({ type: "success", text: "✅ Story updated successfully!" });
        } catch (err) {
            console.error(err.message);
            setMessage({
                type: "error",
                text: "❌ Error updating story: " + err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="textEditorForm">
            <div className="dualInputCntn">
                <div className="UnitInputCntn">
                    <label className="block font-semibold">Title:</label>
                    <input
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full p-2 border rounded"
                        maxLength={120}
                        placeholder="Enter title..."
                    />
                </div>

                <div className="UnitInputCntn">
                    <label className="block font-semibold">Subtitle:</label>
                    <input
                        value={formData.subtitle}
                        onChange={(e) => handleChange("subtitle", e.target.value)}
                        className="w-full p-2 border rounded"
                        maxLength={160}
                        placeholder="Enter subtitle..."
                    />
                </div>
            </div>

            <div className="UnitInputCntn">
                <label className="block font-semibold">Preview Text:</label>
                <textarea
                    value={formData.previewText}
                    onChange={(e) => handleChange("previewText", e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={5}
                    maxLength={300}
                    placeholder="A brief summary of the article..."
                />
            </div>

            <div className="UnitInputCntn quillCntn">
                <label className="block font-semibold">Main Content:</label>
                <ReactQuill
                    value={formData.mainContent}
                    onChange={(content) => handleChange("mainContent", content)}
                    className="textEditorTextBox"
                />
            </div>

            <div className="dualInputCntn">
                <div className="UnitInputCntn">
                    <label className="block font-semibold">Created At</label>
                    <input
                        type="text"
                        readOnly
                        value={new Date(formData.createdAt).toLocaleString()}
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>

                <div className="UnitInputCntn">
                    <label className="block font-semibold">Last Updated:</label>
                    <div className="justFlex">
                        <input
                            type="text"
                            readOnly
                            value={new Date(formData.lastUpdated).toLocaleString()}
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                        <button
                            type="button"
                            className="refreshDateBtn"
                            onClick={refreshTimestamp}
                        >
                            <i title="Refresh Date" className="icofont-refresh"></i>
                        </button>
                    </div>
                </div>
            </div>

            {message.text && (
                <div
                    ref={messageRef}
                    className={`textEditorMsg ${message.type === "error" ? "error" : "msg"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <button type="submit" disabled={loading} className="textEditorSubmitBtn">
                {loading ? "Updating..." : "Update Article"}
            </button>
        </form>
    );
}
