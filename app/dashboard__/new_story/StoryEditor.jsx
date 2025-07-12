"use client";

import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "@/app/db/FirebaseConfig";
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
  where
} from "firebase/firestore";

export default function ArticleEditor() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    previewText: "",
    mainContent: "",
    contentId: "",
    type: 'story',
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    prevStory: { title: "", s_id: "", subtitle: "" },
    nextStory: { title: "", s_id: "", subtitle: "" },
    contentImage: '',
    tags: [],
    summaryDocId: '',
    genres: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const messageRef = useRef(null);

  const refreshTimestamp = () => {
    setFormData((prev) => ({ ...prev, lastUpdated: Date.now() }));
  };

  const getMetaWithCache = async () => {
    const CACHE_KEY = "storylist_meta";
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
    const metaRef = doc(db, "storylist", "_meta");
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

  //Fetch last story and update the form data
  useEffect(() => {
    const fetchLastStory = async () => {
      try {
        const meta = await getMetaWithCache();
        const totalArticles = meta?.totalArticles || 0;

        if (totalArticles === 0) {
          setFormData((prev) => ({
            ...prev,
            contentId: "s_1",
            nextStory: {
              title: "",
              s_id: 's_2',
              subtitle: '',
            },
          }));
          return;
        }

        const lastContentId = `s_${totalArticles}`;
        const storiesRef = collection(db, "stories");
        const q = query(storiesRef, where("contentId", "==", lastContentId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const lastDoc = snapshot.docs[0];
          const lastData = lastDoc.data();
          const newIdNum = totalArticles + 1;
          const nextContentId = `s_${totalArticles + 2}`;

          setFormData((prev) => ({
            ...prev,
            contentId: `s_${newIdNum}`,
            prevStory: {
              title: lastData.title || "",
              s_id: lastData.contentId || "",
              subtitle: lastData.subtitle || '',
            },
            nextStory: {
              title: "",
              s_id: nextContentId,
              subtitle: '',
            },
          }));
        } else {
          // fallback if somehow lastContentId doesn't exist
          setFormData((prev) => ({
            ...prev,
            contentId: `s_${totalArticles + 1}`,
            nextStory: {
              title: "",
              s_id: `s_${totalArticles + 2}`,
              subtitle: '',
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching last story:', error);
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
      summaryDocId: '',
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    }));
  };

  const UpdateStoryList = async () => {
    // Update just the storylist batch based on formData.summaryDocId
    const summary = {
      id: formData?.contentId,
      title: formData?.title,
      subtitle: formData?.subtitle,
      previewText: formData?.previewText,
      summaryImage: formData?.contentImage,
      createdAt: formData?.createdAt,
      genres: formData?.genres
    };

    let summaryDocId = formData?.summaryDocId;

    const metaData = await getMetaWithCache();
    let batchNumber = metaData.lastBatchNumber || 1;
    let totalArticles = metaData.totalArticles || 0;
    

    // If not provided, fallback to legacy batch logic
    if (!summaryDocId) {
      const currentBatchRef = doc(
        db,
        "storylist",
        `summary_${batchNumber.toString().padStart(3, "0")}`
      );
      const currentBatchSnap = await getDoc(currentBatchRef);

      let summaries = currentBatchSnap.exists()
        ? currentBatchSnap.data().articles
        : [];

      // Create new batch if full
      if (summaries.length >= 1500) {
        batchNumber++;
        summaries = [];
      }

      summaries.push(summary);

      const newDocId = `summary_${batchNumber.toString().padStart(3, "0")}`;
      summaryDocId = newDocId;      

      // Save updated batch
      await setDoc(doc(db, "storylist", newDocId), {
        batchNumber,
        articles: summaries,
      });

    } else {

      // If summaryDocId is already available
      const batchRef = doc(db, "storylist", summaryDocId);
      const snap = await getDoc(batchRef);
  
      if (!snap.exists()) {
        throw new Error(`Summary doc ${summaryDocId} does not exist`);
      }
  
      const existing = snap.data().articles || [];
      const updated = [...existing, summary];
  
      await updateDoc(batchRef, { articles: updated });
    }

    const metaRef = doc(db, "storylist", "_meta");
    // Update _meta
      const updatedMeta = {
        lastBatchNumber: batchNumber,
        totalArticles: totalArticles + 1,
        lastUpdated: new Date(),
      };

      await setDoc(metaRef, updatedMeta, { merge: true });
      localStorage.setItem(
        "storylist_meta",
        JSON.stringify({ data: updatedMeta, timestamp: Date.now() })
      );

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
      const articlesRef = collection(db, "stories");

      // Assign summaryDocId if not already set
      if (!formData.summaryDocId) {
        const newDocId = await UpdateStoryList(); // this will calculate batch number
        formData.summaryDocId = newDocId;
      } else {
        await UpdateStoryList(); // will push to known doc
      }
      
      await addDoc(articlesRef, { ...formData });

      setMessage({ type: "success", text: "✅ Article saved successfully!" });
      resetForm();
    } catch (err) {
      console.error(err.message);
      setMessage({ type: "error", text: "❌ Error: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="textEditorForm"
    >

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
            value={formData.prevStory.title ? formData.prevStory.title : "Unavailable"}
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
            value={formData.prevStory.s_id ? formData.prevStory.s_id : "Unavailable"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                prevStory: { ...prev.prevStory, s_id: e.target.value },
              }))
            }
            className="w-full p-2 border rounded"
            readOnly
          />
        </div>
        <div className="UnitInputCntn">
          <label className="block font-semibold">Previous Story Subtitle:</label>
          <input
            value={formData.prevStory.s_id ? formData.prevStory.subtitle : "Unavailable"}
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
            value={formData.nextStory.s_id}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                nextStory: { ...prev.nextStory, s_id: e.target.value },
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
      <div className="dualInputCntn">
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
        <div className="UnitInputCntn">
          <label className="block font-semibold">Genres:</label>
          <input
            value={formData.genres.join(", ")} // join array as comma-separated string for display
            onChange={(e) => {
              const input = e.target.value;

              // Split by comma OR space (one or more spaces), trim each, and filter out empty strings
              const newGenres = input
                .split(/[\s,]+/)
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

              setFormData((prev) => ({
                ...prev,
                genres: newGenres,
              }));
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        
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
            <button type="button" className="refreshDateBtn" onClick={refreshTimestamp}>
              <i title="Refresh Date" className="icofont-refresh"></i>
            </button>
          </div>
        </div>
      </div>

      {message.text && (
        <div
          ref={messageRef}
          className={`textEditorMsg ${message.type === "error"
            ? "error"
            : "msg"
            }`}
        >
          {message.text}
        </div>
      )}

      <button type="submit" disabled={loading} className="textEditorSubmitBtn">
        {loading ? "Saving..." : "Submit Article"}
      </button>
    </form>
  );
}
