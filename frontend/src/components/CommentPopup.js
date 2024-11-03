import React, { useState, useRef } from "react";

const CommentPopup = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const dropzoneRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-gray-100");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-100");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-100");

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload only image files");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    const formData = new FormData();
    formData.append(
      "comment",
      JSON.stringify({
        text: comment,
        createdAt: new Date().toISOString(),
      })
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onSubmit(formData);
    setComment("");
    setImage(null);
    setImageFile(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Leave a Comment</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border rounded mb-4 min-h-[100px]"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <div
            ref={dropzoneRef}
            className="border-2 border-dashed rounded-lg p-4 mb-4 text-center cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                if (e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              };
              input.click();
            }}
          >
            {image ? (
              <div className="relative">
                <img src={image} alt="Preview" className="max-h-40 mx-auto" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setImageFile(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ) : (
              <p>Drag and drop an image here or click to select</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentPopup;
