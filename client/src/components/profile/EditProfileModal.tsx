// src/components/profile/EditProfileModal.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import api from "../../services/api";

type Props = {
  user: {
    username: string;
    bio?: string;
    image_url?: string;
  };
  onClose: () => void;
};

export default function EditProfileModal({ user, onClose }: Props) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    username: user.username || "",
    bio: user.bio || "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.image_url || "");

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("bio", form.bio);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const { data } = await api.patch("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onClose();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.5, // compress to max 500KB
      maxWidthOrHeight: 512, // resize large images
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      setAvatar(compressedFile);

      const previewURL = URL.createObjectURL(compressedFile);
      setPreview(previewURL);
    } catch (error) {
      console.error("Image compression failed", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-[420px] p-6 rounded-lg space-y-4">

        <h2 className="text-lg font-bold">Edit Profile</h2>

        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={preview}
            className="w-20 h-20 rounded-full border object-cover"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Username */}
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Bio */}
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              console.log("Save clicked");
              mutation.mutate();
            }}
            disabled={mutation.isPending}
            className="px-3 py-1 bg-purple-500 text-white rounded"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}