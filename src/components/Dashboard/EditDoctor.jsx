import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`/api/v1/doctors/${id}`);
        const doctor = res.data.data;

        // Set form values
        setValue("name", doctor.user?.name);
        setValue("email", doctor.user?.email);
        setValue("phoneNumber", doctor.user?.phoneNumber);
        setValue("address", doctor.user?.address);
        setValue("specialization", doctor.specialization);
        setValue("experience", doctor.experience);
        setValue("fees", doctor.fees);
        setValue("about", doctor.about);

        if (doctor.image) {
          setPreviewImage(`http://localhost:5000${doctor.image}`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch doctor details");
      }
    };
    fetchDoctor();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Updating doctor...");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("address", data.address);
      formData.append("specialization", data.specialization);
      formData.append("experience", data.experience);
      formData.append("fees", data.fees);
      formData.append("about", data.about);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await axios.patch(`/api/v1/doctors/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Doctor updated successfully!", { id: toastId });
      navigate("/dashboard/doctor-list");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update doctor", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Edit Doctor
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className="w-full p-3 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="w-full p-3 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone
            </label>
            <input
              {...register("phoneNumber")}
              type="text"
              className="w-full p-3 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Address
            </label>
            <input
              {...register("address")}
              type="text"
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Doctor Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Specialization
            </label>
            <input
              {...register("specialization", { required: "Required" })}
              type="text"
              className="w-full p-3 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Experience
            </label>
            <input
              {...register("experience", { required: "Required" })}
              type="text"
              className="w-full p-3 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fees
            </label>
            <input
              {...register("fees", { required: "Required" })}
              type="number"
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Profile Picture
            </label>
            <input
              {...register("image")}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border rounded bg-white"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="h-20 w-20 object-cover mt-2 rounded-full border"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            About
          </label>
          <textarea
            {...register("about")}
            rows="4"
            className="w-full p-3 border rounded"
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/doctor-list")}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? "Updating..." : "Update Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;
