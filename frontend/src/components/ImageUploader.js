import React, { useRef, useState } from "react";

const ImageUploader = ({ currentImage, onImageSelect, className }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage || null);
  const dropzoneRef = useRef(null);
  const [error, setError] = useState("");

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
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    onImageSelect(file);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onImageSelect(null);
  };

  return (
    <div className={className}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div
        ref={dropzoneRef}
        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
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
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 mx-auto rounded"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="py-8">
            <p>Drag and drop an image here or click to select</p>
            <p className="text-sm text-gray-500 mt-1">
              Supports: JPG, PNG, GIF (max 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
