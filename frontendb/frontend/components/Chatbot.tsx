"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SendHorizontal, X } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Guardar posición del scroll al cerrar
  const handleClose = () => {
    if (chatContainerRef.current) {
      setScrollPosition(chatContainerRef.current.scrollTop);
    }
    setIsOpen(false);
  };

  // Restaurar posición del scroll al abrir
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = scrollPosition;
    }
  }, [isOpen]);

  const messagesEndRef = useRef<HTMLDivElement>(null);  // Nuevo ref para el scroll

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efecto para scroll cuando hay nuevos mensajes o se abre el chat
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Función para manejar el envío de un mensaje
  const sendMessage = async () => {
    if (!userMessage) return;

    // Añadir el mensaje del usuario a la lista de mensajes
    setMessages([...messages, { sender: 'user', text: userMessage }]);
    setUserMessage("");  // Limpiar el campo de entrada

    try {
      // Enviar el mensaje al backend (asegúrate de que la URL sea la correcta)
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // Check for HTTP errors first
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error desconocido');
      }

      // Verify content type
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
          throw new TypeError('Respuesta no es JSON');
      }

      const data = await response.json();
      const botMessage = data.response;

      // Añadir la respuesta del bot a la lista de mensajes
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botMessage },
      ]);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  // Añadir efecto para ajustar altura
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [userMessage]);

  return (
    <>
      {/* Botón flotante responsivo */}
      <button
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-16 h-16 md:w-20 md:h-20 rounded-full transition z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src="https://farm5.staticflickr.com/4876/39891228293_13c532f352_o.gif" 
          alt="Chatbot" 
          className="w-full h-full object-contain"
        />
      </button>

      {/* Ventana de chat responsiva */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 right-4 md:bottom-20 md:right-6 w-80 md:w-96 bg-sky-100 dark:bg-sky-900 p-3 md:p-4 rounded-lg shadow-lg space-y-3 md:space-y-4 z-50"
          >
            {/* Header responsivo */}
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 md:w-10 md:h-10">
                <AvatarImage src="https://sm.ign.com/ign_es/cover/b/bob-the-bu/bob-the-builder-the-movie_r5y4.jpg" />
                <AvatarFallback>CB</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-white">Juan Carlos Bodoque</h3>
              <button
                className="ml-auto text-gray-600 hover:text-gray-800 transition dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Área de mensajes responsiva */}
            <div 
              ref={chatContainerRef} 
              className="flex flex-col space-y-3 bg-gray-100 p-2 md:p-4 rounded-lg h-64 md:h-96 overflow-y-auto dark:bg-slate-700"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.sender === 'bot' ? "self-start bg-gray-300 dark:bg-gray-500" : "self-end bg-blue-500 text-white"
                  } p-2 rounded-lg max-w-[90%] text-sm md:text-base break-words whitespace-pre-wrap`}
                >
                  <h3 className="whitespace-pre-line">{msg.text}</h3>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Elemento de referencia para el scroll */}
            </div>

            {/* Input responsivo */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-700 p-2 rounded-lg shadow">
              <textarea
                ref={textAreaRef}
                placeholder="Escribe un mensaje..."
                className="flex-1 dark:bg-slate-700 text-sm md:text-base resize-none overflow-hidden max-h-32 border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="px-2 md:px-4 self-end"
                onClick={sendMessage}
              >
                <SendHorizontal className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
