/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Demande from "@/models/Demande";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/authAxios";
import withAuth from "@/hoc/withAuth";

const DemandesPage = () => {
  const [demandes, setDemandes] = useState<Demande[]>([]);

  useEffect(() => {
    const fetchDemandes = async () => {
      const res = await authAxios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/demandes/all`
      );
      setDemandes(res.data.data);
    };
    fetchDemandes();
  }, []);

  const handleDeleteDemande = async (demandeId: string) => {
    try {
      await authAxios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/demandes/delete/${demandeId}`
      );
      setDemandes((prevDemandes) =>
        prevDemandes.filter((p) => p._id !== demandeId)
      );
      toast.success("Demande supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de demande:", error);
      toast.error("Échec de la suppression de demande: " + error);
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
      <div className="w-full bg-white rounded-3xl shadow-2xl shadow-gray-200 px-4 md:px-8 p-8 flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Liste des Demandes{" "}
            <span className="text-lg truncate">
              ({demandes.length} demande
              {demandes.length > 1 ? "s" : ""})
            </span>
          </h1>
          <div className="flex flex-wrap gap-6">
            {demandes.map((demande) => (
              <div
                key={demande._id}
                className="group relative flex flex-col items-start gap-4 border rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                <Trash2
                  onClick={() => handleDeleteDemande(demande._id)}
                  className="hidden group-hover:flex absolute top-2 right-2 w-6 h-6 text-red-500 cursor-pointer"
                />

                <span className="font-bold text-xl hover:underline">
                  {demande.fullname}
                </span>

                <div className="flex flex-wrap gap-2">
                  <span className="font-bold">Date de naissance :</span>
                  <span>
                    {new Date(demande.birthdate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-bold">Téléphone :</span>
                  <span>{demande.phone}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-bold">Genre :</span>
                  <span>{demande.gender}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-bold">Adresse :</span>
                  <span>{demande.address}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-bold">Nom du projet :</span>
                  <span>{demande.projectName}</span>
                </div>
                {demande.projectObjectifs && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-bold">Objectifs du projet :</span>
                    <span>{demande.projectObjectifs}</span>
                  </div>
                )}
                {demande.projectCompetitors && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-bold">Concurrents du projet :</span>
                    <span>{demande.projectCompetitors}</span>
                  </div>
                )}
                {demande.coordinates && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-bold">Coordonnées :</span>
                    <span>{demande.coordinates}</span>
                  </div>
                )}
                {demande.features && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-bold">Fonctionnalités :</span>
                    <span>{demande.features}</span>
                  </div>
                )}
                {demande.target && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-bold">Cible :</span>
                    <span>{demande.target}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default withAuth(DemandesPage);
