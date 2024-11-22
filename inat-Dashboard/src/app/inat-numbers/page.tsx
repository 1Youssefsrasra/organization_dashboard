/* eslint-disable @next/next/no-img-element */
"use client";

import CustomFormInput from "@/components/CustomFormInput";
import { useEffect, useState } from "react";
import Chiffres from "@/models/Chiffres";
import { toast } from "react-toastify";
import CustomButton from "@/components/CustomButton";
import { authAxios } from "@/utils/authAxios";
import withAuth from "@/hoc/withAuth";

const InatNumbersPage = () => {
  const [formData, setFormData] = useState<Chiffres>({
    _id: "",
    projetsLivres: "",
    collaborateurs: "",
    EditionForum: "",
    TauxStatisfaction: "",
    TauxEmployabilite: "",
    ActionsRSE: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchChiffres = async () => {
      try {
        const res = await authAxios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/chiffres/all`
        );
        if (res.data[0]) {
          setFormData(res.data[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Échec de la récupération des données");
      } finally {
        setLoading(false);
      }
    };
    fetchChiffres();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    return (
      formData.projetsLivres &&
      formData.collaborateurs &&
      formData.EditionForum &&
      formData.TauxStatisfaction &&
      formData.TauxEmployabilite &&
      formData.ActionsRSE
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setSaving(true);

    const url = formData._id
      ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/chiffres/update/${formData._id}`
      : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/chiffres/add`;

    const method = formData._id ? "put" : "post";

    try {
      const res = await authAxios[method](url, formData);
      toast.success("Informations sauvegardées avec succès");
      if (!formData._id) {
        setFormData(res.data);
      }
    } catch (error) {
      console.error(
        `Erreur lors de ${
          formData._id ? "la mise à jour" : "l'ajout"
        } des informations:`,
        error
      );
      toast.error(
        `Échec ${
          formData._id ? "de la mise à jour" : "de l'ajout"
        } des informations: ${error}`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <main className="flex p-4 lg:p-14 w-full min-h-screen text-grey">
      <div className="w-full bg-white rounded-3xl shadow-2xl shadow-gray-200 px-4 md:px-8 p-8 flex flex-col md:flex-row gap-4">
        <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Modifier la section INAT en chiffres
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <CustomFormInput
              label="Nombre de projets livrés *"
              name="projetsLivres"
              value={formData.projetsLivres}
              onChange={handleInputChange}
              type="number"
            />
            <CustomFormInput
              label="Nombre d'éditions du forum *"
              name="EditionForum"
              value={formData.EditionForum}
              onChange={handleInputChange}
              type="number"
            />
            <CustomFormInput
              label="Actions RSE *"
              name="ActionsRSE"
              value={formData.ActionsRSE}
              onChange={handleInputChange}
              type="number"
            />
            <CustomFormInput
              label="Nombre de collaborateurs *"
              name="collaborateurs"
              value={formData.collaborateurs}
              onChange={handleInputChange}
              type="number"
            />
            <CustomFormInput
              label="Taux de satisfaction *"
              name="TauxStatisfaction"
              value={formData.TauxStatisfaction}
              onChange={handleInputChange}
              type="number"
            />
            <CustomFormInput
              label="Taux d'employabilité *"
              name="TauxEmployabilite"
              value={formData.TauxEmployabilite}
              onChange={handleInputChange}
              type="number"
            />
          </div>

          <CustomButton type="submit" loading={saving}>
            Confirmer
          </CustomButton>
        </form>
      </div>
    </main>
  );
};
export default withAuth(InatNumbersPage);
