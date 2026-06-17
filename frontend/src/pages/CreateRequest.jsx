import { useState } from "react";
import { createRequest } from "../services/request";

const CreateRequest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createRequest({
        title,
        description,
      });

      alert("Request created successfully");

      setTitle("");
      setDescription("");

    } catch (err) {
      console.log(err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded w-[400px] space-y-4"
      >
        <h2 className="text-xl font-bold">Create Request</h2>

        <input
          className="w-full p-2 bg-gray-800"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 bg-gray-800"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="bg-blue-600 w-full p-2"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;