import { useState } from "react";

export default function DashboardResources() {
  const [showSupportingDocument, setShowSupportingDocument] = useState(false);
  const [showCommunityResource, setShowCommunityResource] = useState(false);

  return (
    <>
      {/* Resource Buttons */}
      <div className="mt-7 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-24">
        <button
          onClick={() => setShowSupportingDocument(true)}
          className="w-full sm:w-auto border border-black rounded-md px-8 sm:px-12 py-2 text-base sm:text-lg hover:bg-gray-100 transition"
        >
          Read our
          <br />
          Methodology
        </button>

        <button
          onClick={() => setShowCommunityResource(true)}
          className="w-full sm:w-auto border border-black rounded-md px-8 sm:px-12 py-2 text-base sm:text-lg hover:bg-gray-100 transition"
        >
          View our
          <br />
          Infographics
        </button>
      </div>

      {/* Supporting Document Modal */}
      {showSupportingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowSupportingDocument(false)}
              className="absolute right-4 top-3 text-2xl text-gray-500 hover:text-black"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-2xl font-medium">Supporting Document</h2>

            <p className="mt-4 text-gray-600">
              Supporting documents for the AI Ethics Dashboard will be available
              here.
            </p>
          </div>
        </div>
      )}

      {/* Community Resource Modal */}
      {showCommunityResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowCommunityResource(false)}
              className="absolute right-4 top-3 text-2xl text-gray-500 hover:text-black"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-2xl font-medium">Community Resource</h2>

            <p className="mt-4 text-gray-600">
              Community resources and infographics will be available here.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
