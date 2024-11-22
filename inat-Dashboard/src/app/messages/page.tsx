"use client";

import MessageModal from "@/components/MessageModal";
import Message from "./../../models/Message";
import { Eye, Trash2 } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { authAxios } from "@/utils/authAxios";
import withAuth from "@/hoc/withAuth";

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageModalOpen, setMessageModalOpen] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authAxios.get(
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/messages/all"
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (message: Message) => {
    setSelectedMessage(message);
    setMessageModalOpen(true);
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await authAxios.delete(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          "/messages/delete/" +
          messageId
      );
      toast.success("Message supprimé avec succès");
      setMessages((prev) => prev.filter((p) => p._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <Fragment>
      <main className="flex p-4 lg:p-14 w-full min-h-screen text-grey">
        <div className="w-full bg-white rounded-3xl shadow-2xl shadow-gray-200 px-4 md:px-8 p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Messages
            </h1>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="w-full grid grid-cols-3 lg:grid-cols-4 items-center justify-center border-b text-grey px-4 pb-2">
              <span className="text-sm sm:text-lg font-bold">
                Nom et prénom
              </span>
              <span className="text-sm  hidden lg:block sm:text-lg font-bold">
                Email
              </span>
              <span className="text-sm sm:text-lg font-bold">Contenu</span>
              <span className="text-sm sm:text-lg font-bold place-self-end px-4">
                Actions
              </span>
            </div>
            {loading && <p>Loading...</p>}

            {messages.map((message, index) => (
              <div
                key={`${message._id}-${index}`}
                className="w-full grid grid-cols-3 lg:grid-cols-4 items-center border-b pb-1 text-grey px-4"
              >
                <span className="text-sm sm:text-base font-semibold">
                  {message.fullname}
                </span>

                <div className=" text-sm sm:text-base hidden lg:block font-bold truncate">
                  <Link
                    href={`mailto:${message.email}`}
                    target="_blank"
                    className="hover:underline hover:text-primary app_transition"
                  >
                    {message.email}
                  </Link>
                </div>
                <div className="text-sm sm:text-base truncate">
                  {message.text}
                </div>

                <div className="text-sm sm:text-base flex rounded-full place-self-end gap-0">
                  <button
                    className="group hover:bg-gray-100 rounded-full p-2 lg:p-3"
                    onClick={() => handleOpenModal(message)}
                  >
                    <Eye className="text-gray-400 group-hover:text-yellow-500" />
                  </button>
                  <button
                    className="group hover:bg-gray-100 rounded-full p-2 lg:p-3"
                    onClick={() => handleDeleteMessage(message._id)}
                  >
                    <Trash2 className="text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {selectedMessage && (
        <MessageModal
          open={messageModalOpen}
          onClose={() => setMessageModalOpen(false)}
        >
          <div className=" flex flex-col gap-2 text-lg">
            <p>
              Nom et Prénom:{" "}
              <span className="font-semibold">{selectedMessage.fullname}</span>
            </p>
            <p>
              Email:
              <span className="font-semibold"> {selectedMessage.email}</span>
            </p>
            <p>
              Message:{" "}
              <span className="font-semibold">{selectedMessage.text}</span>
            </p>
          </div>
        </MessageModal>
      )}
    </Fragment>
  );
};

export default withAuth(MessagesPage);
