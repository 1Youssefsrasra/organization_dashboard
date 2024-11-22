"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useEdgeStore } from "@/lib/edgestore";
import CustomFormInput from "@/components/CustomFormInput";
import { FileState, MultiImageDropzone } from "@/components/multi-image-dropzone";
import CustomButton from "@/components/CustomButton";
import { authAxios } from "@/utils/authAxios";
import withAuth from "@/hoc/withAuth";

const EventPage = () => {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [loading, setLoading] = useState(false);
  const { edgestore } = useEdgeStore();

  const [eventData, setEventData] = useState({
    id: "", // Add id to state
    title: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await authAxios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/event/get`);
        const { id = "", title = "", description = "", images = [] } = res.data || {};
        setEventData({ id, title, description, images }); // Set id from response
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'événement:", error);
      }
    };
    fetchEvent();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, title, description } = eventData; // Extract id from eventData
    if (!title.trim()) {
      toast.error("Veuillez fournir un titre.");
      return;
    }
    if (!description.trim()) {
      toast.error("Veuillez fournir une description.");
      return;
    }

    try {
      setLoading(true);

      // Delete files only if images are modified
      if (fileStates.length > 0) {
        const deletedFilesPromises = eventData.images.map((url) =>
          edgestore.myPublicFiles.delete({ url }).catch((err) => {
            console.error("Erreur lors de la suppression du fichier:", err);
            return null;
          })
        );
        await Promise.all(deletedFilesPromises);
      }

      const uploadedFiles = await Promise.all(
        fileStates.map(async (fileState: any) => {
          try {
            const res = await edgestore.myPublicFiles.upload({
              file: fileState.file,
              onProgressChange: async (progress) => {
                updateFileProgress(fileState.key, progress);
                if (progress === 100) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  updateFileProgress(fileState.key, "COMPLETE");
                }
              },
            });
            return res.url;
          } catch (err) {
            console.error("Erreur lors du téléchargement du fichier:", err);
            return null;
          }
        })
      );

      const res = await authAxios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/event/add`, // Ensure this endpoint expects an update request
        {
          id, // Include the event ID
          title,
          description,
          images: uploadedFiles.length > 0 ? uploadedFiles : eventData.images,
        }
      );

      setEventData((prevData: any) => ({
        ...prevData,
        images: uploadedFiles.length > 0 ? uploadedFiles : prevData.images,
      }));
      setFileStates([]);

      toast.success("Événement mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement:", error);
    } finally {
      setLoading(false);
    }
  };

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) =>
      fileStates.map((fileState) =>
        fileState.key === key ? { ...fileState, progress } : fileState
      )
    );
  }

  return (
    <main className="flex p-4 lg:p-14 w-full min-h-screen text-grey">
      <div className="w-full bg-white rounded-3xl shadow-2xl shadow-gray-200 px-4 md:px-8 p-8 flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Images Actuelles{" "}
            <span className="text-lg truncate">
              ({eventData.images.length} image
              {eventData.images.length > 1 ? "s" : ""})
            </span>
          </h1>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {eventData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index}`}
                className="h-32 object-cover rounded-md border"
              />
            ))}
          </div>
        </div>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Modifier les informations
          </h1>
          <CustomFormInput
            label="Titre de l'événement *"
            name="title"
            value={eventData.title}
            onChange={handleInputChange}
          />
          <CustomFormInput
            label="Description de l'événement *"
            name="description"
            type="textarea"
            value={eventData.description}
            onChange={handleInputChange}
            classname="min-h-60"
          />

          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold">Changer les images *</label>
            <MultiImageDropzone
              value={fileStates}
              dropzoneOptions={{
                maxFiles: 50,
              }}
              onChange={(files) => {
                setFileStates(files);
              }}
            />
          </div>

          <CustomButton type="submit" loading={loading}>
            Confirmer
          </CustomButton>
        </form>
      </div>
    </main>
  );
};

export default withAuth(EventPage);
