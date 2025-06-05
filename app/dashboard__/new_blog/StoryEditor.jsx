"use client";

import { useEffect, useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "@/app/db/FirebaseConfig";
import { storage } from "@/app/db/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function ArticleEditor() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    previewText: "",
    mainContent: "",
    contentId: "",
    type: "blog",
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    prevStory: { title: "", b_id: "", subtitle: "" },
    nextStory: { title: "", b_id: "", subtitle: "" },
    contentImage: "",
    tags: [],
    summaryDocId: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const messageRef = useRef(null);

  const refreshTimestamp = () => {
    setFormData((prev) => ({ ...prev, lastUpdated: Date.now() }));
  };

  useEffect(() => {
    const fetchLastStory = async () => {
      try {
        const storiesRef = collection(db, "blogs");
        const q = query(storiesRef, orderBy("createdAt", "desc"), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const lastDoc = snapshot.docs[0];
          const lastData = lastDoc.data();
          const lastIdNum = parseInt(lastData.contentId?.split("_")[1] || "0");

          const newIdNum = lastIdNum + 1;
          const newContentId = `b_${newIdNum}`;
          const nextContentId = `b_${lastIdNum + 2}`;

          setFormData((prev) => ({
            ...prev,
            contentId: newContentId,
            prevStory: {
              title: lastData.title || "",
              b_id: lastData.contentId || "",
              subtitle: lastData.subtitle,
            },
            nextStory: {
              title: "",
              b_id: nextContentId,
              subtitle: "",
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            contentId: "b_1",
            nextStory: {
              title: "",
              b_id: "b_2",
              subtitle: "",
            },
          }));
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Error fetching last story: " + error.message,
        });
      }
    };

    fetchLastStory();
  }, [formData.lastUpdated]);

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

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      title: "",
      subtitle: "",
      previewText: "",
      mainContent: "",
      lastUpdated: Date.now(),
    }));
  };

  const getMetaWithCache = async () => {
    const CACHE_KEY = "bloglist_meta";
    const EXPIRY_HOURS = 6;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const ageInMs = Date.now() - timestamp;
        const expiryInMs = EXPIRY_HOURS * 60 * 60 * 1000;

        if (ageInMs < expiryInMs) {
          console.log("🔁 Using cached _meta");
          return data;
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    console.log("📡 Fetching _meta from Firestore");
    const metaRef = doc(db, "bloglist", "_meta");
    const metaSnap = await getDoc(metaRef);

    if (!metaSnap.exists()) {
      return {
        lastBatchNumber: 1,
        totalArticles: 0,
      };
    }

    const data = metaSnap.data();
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
    return data;
  };

  const Updatebloglist = async () => {
    // Update just the bloglist batch based on formData.summaryDocId
    const summary = {
      id: formData?.contentId,
      title: formData?.title,
      subtitle: formData?.subtitle,
      previewText: formData?.previewText,
      tags: formData?.tags,
      summaryImage: formData?.contentImage,
      createdAt: formData?.createdAt,
    };

    let summaryDocId = formData?.summaryDocId;

    // If not provided, fallback to legacy batch logic
    if (!summaryDocId) {
      const metaData = await getMetaWithCache();
      let batchNumber = metaData.lastBatchNumber || 1;
      let totalArticles = metaData.totalArticles || 0;

      const currentBatchRef = doc(
        db,
        "bloglist",
        `summary_${batchNumber.toString().padStart(3, "0")}`
      );
      const currentBatchSnap = await getDoc(currentBatchRef);

      let summaries = currentBatchSnap.exists()
        ? currentBatchSnap.data().articles
        : [];

      // Create new batch if full
      if (summaries.length >= 500) {
        batchNumber++;
        summaries = [];
      }

      summaries.push(summary);

      const newDocId = `summary_${batchNumber.toString().padStart(3, "0")}`;
      summaryDocId = newDocId;

      // Save updated batch
      await setDoc(doc(db, "bloglist", newDocId), {
        batchNumber,
        articles: summaries,
      });

      // Update _meta
      const updatedMeta = {
        lastBatchNumber: batchNumber,
        totalArticles: totalArticles + 1,
        lastUpdated: new Date(),
      };
      const metaRef = doc(db, "bloglist", "_meta");
      await setDoc(metaRef, updatedMeta, { merge: true });
      localStorage.setItem(
        "bloglist_meta",
        JSON.stringify({ data: updatedMeta, timestamp: Date.now() })
      );

      return newDocId;
    }

    // If summaryDocId is already available
    const batchRef = doc(db, "bloglist", summaryDocId);
    const snap = await getDoc(batchRef);

    if (!snap.exists()) {
      throw new Error(`Summary doc ${summaryDocId} does not exist`);
    }

    const existing = snap.data().articles || [];
    const updated = [...existing, summary];

    await updateDoc(batchRef, { articles: updated });
    return summaryDocId;
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

    setLoading(true);
    try {
      const articlesRef = collection(db, "blogs");

      // Assign summaryDocId if not already set
      if (!formData.summaryDocId) {
        const newDocId = await Updatebloglist(); // this will calculate batch number
        formData.summaryDocId = newDocId;
      } else {
        await Updatebloglist(); // will push to known doc
      }

      await addDoc(articlesRef, { ...formData });

      setMessage({ type: "success", text: "✅ Blog saved successfully!" });
      resetForm();
    } catch (err) {
      console.error(err.message);
      setMessage({ type: "error", text: "❌ Error: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const storageRef = ref(storage, `blogImages/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    setFormData((prev) => ({
      ...prev,
      contentImage: downloadURL,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="textEditorForm">
      {/* <div className="UnitInputCntn">
        <label className="block font-semibold">Content Image:</label>
        <div className="textEditorImagePickerCntn">
          <input type="file" accept="image/*" onChange={handleFileChange} />


          <div className={`imagePickerIcon ${formData?.contentImage ? 'noShow' : ""}`} >
            <i className="icofont-plus"></i>
            <p>{formData?.contentImage ? "Change" : "Pick"}</p>
          </div>
        </div>
      </div> */}

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

      {/* Preview Text */}
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

      {/* Main Article */}
      <div className="UnitInputCntn quillCntn">
        <label className="block font-semibold">Main Content:</label>
        <ReactQuill
          value={formData.mainContent}
          onChange={(content) => handleChange("mainContent", content)}
          className="textEditorTextBox"
        />
      </div>

      {/* Prev Story */}
      <div className="dualInputCntn">
        <div className="UnitInputCntn">
          <label className="block font-semibold">Previous Story Title:</label>
          <input
            value={
              formData.prevStory.title
                ? formData.prevStory.title
                : "Unavailable"
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                prevStory: { ...prev.prevStory, title: e.target.value },
              }))
            }
            className="w-full p-2 border rounded"
            readOnly
          />
        </div>
        <div className="UnitInputCntn">
          <label className="block font-semibold">Previous Story ID:</label>
          <input
            value={
              formData.prevStory.b_id ? formData.prevStory.b_id : "Unavailable"
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                prevStory: { ...prev.prevStory, b_id: e.target.value },
              }))
            }
            className="w-full p-2 border rounded"
            readOnly
          />
        </div>
        <div className="UnitInputCntn">
          <label className="block font-semibold">
            Previous Story Subtitle:
          </label>
          <input
            value={
              formData.prevStory.b_id
                ? formData.prevStory.subtitle
                : "Unavailable"
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                prevStory: { ...prev.prevStory, subtitle: e.target.value },
              }))
            }
            className="w-full p-2 border rounded"
            readOnly
          />
        </div>
      </div>
      {/* Next Story */}
      <div className="dualInputCntn">
        <div className="UnitInputCntn">
          <label className="block font-semibold">Next Story Title:</label>
          <input
            value={formData.nextStory.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                nextStory: { ...prev.nextStory, title: e.target.value },
              }))
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="UnitInputCntn">
          <label className="block font-semibold">Next Story ID:</label>
          <input
            value={formData.nextStory.b_id}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                nextStory: { ...prev.nextStory, b_id: e.target.value },
              }))
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="UnitInputCntn">
          <label className="block font-semibold">Next Story Subtitle:</label>
          <input
            value={formData.nextStory.subtitle}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                nextStory: { ...prev.nextStory, subtitle: e.target.value },
              }))
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <div className="UnitInputCntn">
        <label className="block font-semibold">Tags:</label>
        <input
          value={formData.tags.join(", ")} // join array as comma-separated string for display
          onChange={(e) => {
            const input = e.target.value;

            // Split by comma OR space (one or more spaces), trim each, and filter out empty strings
            const newTags = input
              .split(/[\s,]+/)
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);

            setFormData((prev) => ({
              ...prev,
              tags: newTags,
            }));
          }}
          className="w-full p-2 border rounded"
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
          className={`textEditorMsg ${
            message.type === "error" ? "error" : "msg"
          }`}
        >
          {message.text}
        </div>
      )}

      <button type="submit" disabled={loading} className="textEditorSubmitBtn">
        {loading ? "Saving..." : "Submit Blog"}
      </button>
    </form>
  );
}
