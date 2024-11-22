/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Document from "@/models/Document";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import CustomFormInput from "@/components/CustomFormInput";
import CustomButton from "@/components/CustomButton";
import { authAxios } from "@/utils/authAxios";
import withAuth from "@/hoc/withAuth";
import Link from "next/link";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [formData, setFormData] = useState({
    label: "",
    link: "",
    mandate: "",
    description: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      const res = await authAxios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/documents/all`
      );
      setDocuments(res.data);
    };
    fetchDocuments();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.label) {
      toast.error("Veuillez fournir un nom au document.");
      return;
    }

    if (!formData.mandate) {
      toast.error("Veuillez fournir le mandat du document.");
      return;
    }

    if (!formData.link) {
      toast.error("Veuillez fournir un lien au document.");
      return;
    }

    try {
      setLoading(true);
      const res = await authAxios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/documents/add`,
        formData
      );

      const newDocument = res.data.document;
      setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
      toast.success("Document ajoutée avec succès");
      setFormData({
        label: "",
        mandate: "",
        link: "",
        description: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error("Échec de l'ajout du document: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await authAxios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/documents/delete/${documentId}`
      );
      setDocuments((prevDocuments) =>
        prevDocuments.filter((p) => p._id !== documentId)
      );
      toast.success("Document supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de document:", error);
      toast.error("Échec de la suppression de document: " + error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <main className="flex p-4 lg:p-14 w-full min-h-screen text-grey">
      <div className="w-full bg-white rounded-3xl shadow-2xl shadow-gray-200 px-4 md:px-8 p-8 flex flex-col md:flex-row gap-10">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Liste des Documents{" "}
            <span className="text-lg truncate">
              ({documents.length} document
              {documents.length > 1 ? "s" : ""})
            </span>
          </h1>
          <div className="flex flex-wrap gap-6">
            {documents.map((document) => (
              <div
                key={document._id}
                className="group relative flex flex-col items-start gap-2 border rounded-xl p-4 hover:scale-[101%] app_transition w-full"
              >
                <Trash2
                  onClick={() => handleDeleteDocument(document._id)}
                  className="hidden group-hover:flex absolute right-2 top-2 w-6 h-6 text-red-500 cursor-pointer app_transition"
                />

                <Link
                  href={document.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-2xl hover:underline app_transition"
                >
                  {document.label}
                </Link>
                <h2 className="font-semibold text-primary ">
                  {document.mandate}
                </h2>
                <span className="font-medium text-grey">
                  {document.description}
                </span>
                <span className="font-bold">
                  {formatDate(document.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Ajouter un Document
          </h1>
          <CustomFormInput
            label="Nom du document *"
            name="label"
            value={formData.label}
            onChange={handleInputChange}
            placeholder="Politique RSE"
          />
          <CustomFormInput
            label="Mandat du document *"
            name="mandate"
            value={formData.mandate}
            onChange={handleInputChange}
            placeholder="2024/2025"
          />

          <CustomFormInput
            label="Lien Drive du document *"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
          />
          <CustomFormInput
            label="Description du document"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            type="textarea"
            classname="h-32"
          />

          <CustomButton type="submit" loading={loading}>
            Confirmer
          </CustomButton>
        </form>
      </div>
    </main>
  );
};

export default withAuth(DocumentsPage);
