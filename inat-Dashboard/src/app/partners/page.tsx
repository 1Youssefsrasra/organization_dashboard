/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Partner from "@/models/Partner";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useEdgeStore } from "@/lib/edgestore";
import CustomFormInput from "@/components/CustomFormInput";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import CustomButton from "@/components/CustomButton";
import { authAxios } from "@/utils/authAxios";
import withAuth from "@/hoc/withAuth";

const PartnersPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState<number>(0);
  const [formData, setFormData] = useState({ name: "" });
  const [imageRequiredError, setImageRequiredError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPartners = async () => {
      const res = await authAxios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/partners/all`
      );
      setPartners(res.data);
    };
    fetchPartners();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpload = async () => {
    if (file) {
      const res = await edgestore.myPublicImages.upload({
        file,
        input: { type: "partners" },
        onProgressChange: (progress) => setProgress(progress),
      });
      return res.url;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Veuillez fournir un nom.");
      return;
    }
    if (!file) {
      setImageRequiredError(true);
      return;
    }

    try {
      setLoading(true);
      const uploadedUrl = await handleUpload();
      const res = await authAxios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/partners/add`,
        { name: formData.name, logo: uploadedUrl }
      );

      const newPartner = res.data.partner;
      setPartners((prevPartners) => [...prevPartners, newPartner]);
      toast.success("Partenaire ajouté avec succès");
      setFormData({ name: "" });
      setFile(undefined);
      setProgress(0);
      setImageRequiredError(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du partenaire:", error);
      toast.error("Échec de l'ajout du partenaire: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePartner = async (partnerId: string, logoUrl: string) => {
    try {
      await edgestore.myPublicImages.delete({ url: logoUrl });
      await authAxios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/partners/delete/${partnerId}`
      );
      setPartners((prevPartners) =>
        prevPartners.filter((p) => p._id !== partnerId)
      );
      toast.success("Partenaire supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du partenaire:", error);
      toast.error("Échec de la suppression du partenaire: " + error);
    }
  };

  return (
    <main className="flex p-4 lg:p-14 w-full min-h-screen text-grey">
      <div className="w-full bg-white rounded-3xl shadow-2xl shadow-gray-200 px-4 md:px-8 p-8 flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Liste des Partenaires{" "}
            <span className="text-lg truncate">
              ({partners.length} partenaire
              {partners.length > 1 ? "s" : ""})
            </span>
          </h1>
          <div className="flex flex-wrap gap-6">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="group relative flex flex-wrap items-center gap-2 border rounded p-4 hover:scale-[102%] app_transition"
              >
                <Trash2
                  onClick={() => handleDeletePartner(partner._id, partner.logo)}
                  className="hidden group-hover:flex absolute right-2 top-2 w-6 h-6 text-red-500 cursor-pointer app_transition"
                />
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="object-cover h-20 rounded overflow-hidden"
                />
                <p className="font-bold">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Ajouter un Partenaire
          </h1>
          <CustomFormInput
            label="Nom du partenaire *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold">Logo du partenaire *</label>
            <SingleImageDropzone
              width={200}
              height={200}
              value={file}
              dropzoneOptions={{ maxSize: 1024 * 1024 * 1 }} // 1 MB
              onChange={(file) => {
                setFile(file);
                setImageRequiredError(false); // Reset image required error state on image change
              }}
            />
            {progress > 0 && (
              <div className="h-[6px] w-44 border rounded overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            {imageRequiredError && (
              <p className="text-red-500">Veuillez sélectionner une image.</p>
            )}
          </div>
          <CustomButton type="submit" loading={loading}>
            Confirmer
          </CustomButton>
        </form>
      </div>
    </main>
  );
};

export default withAuth(PartnersPage);
