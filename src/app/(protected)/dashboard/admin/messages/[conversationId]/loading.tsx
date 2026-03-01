"use client";

import { ArrowLeft } from "lucide-react";

export default function ConversationDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* En-tête skeleton */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2">
            <ArrowLeft className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>

          <div>
            {/* Titre skeleton */}
            <div className="h-5 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
            {/* Sous-titre skeleton */}
            <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Boutons d'action skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Zone des messages skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
        {/* Séparateur de date skeleton */}
        <div className="flex items-center justify-center my-6">
          <div className="w-32 h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
        </div>

        {/* Messages de l'autre personne skeleton */}
        <div className="flex justify-start mb-4">
          <div className="max-w-[70%]">
            {/* En-tête du message skeleton */}
            <div className="flex items-center mb-1 ml-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="ml-2 h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            {/* Bulle de message skeleton */}
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3">
              <div className="space-y-2">
                <div className="h-4 w-64 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
              {/* Pied du message skeleton */}
              <div className="flex items-center justify-end mt-1">
                <div className="h-3 w-12 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Message de l'admin (droite) skeleton */}
        <div className="flex justify-end mb-4">
          <div className="max-w-[70%]">
            <div className="bg-blue-600/50 rounded-lg p-3">
              <div className="space-y-2">
                <div className="h-4 w-56 bg-blue-400/50 rounded animate-pulse"></div>
                <div className="h-4 w-40 bg-blue-400/50 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center justify-end mt-1">
                <div className="h-3 w-12 bg-blue-400/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Message avec média skeleton */}
        <div className="flex justify-start mb-4">
          <div className="max-w-[70%]">
            <div className="flex items-center mb-1 ml-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3">
              <div className="h-4 w-48 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
              {/* Media preview skeleton */}
              <div className="mt-2 w-48 h-32 bg-gray-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div className="flex items-center justify-end mt-1">
                <div className="h-3 w-12 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième séparateur de date skeleton */}
        <div className="flex items-center justify-center my-6">
          <div className="w-32 h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
        </div>

        {/* Groupe de messages suivants skeleton */}
        <div className="flex justify-end mb-4">
          <div className="max-w-[70%]">
            <div className="bg-blue-600/50 rounded-lg p-3">
              <div className="space-y-2">
                <div className="h-4 w-64 bg-blue-400/50 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center justify-end mt-1">
                <div className="h-3 w-12 bg-blue-400/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-start mb-4">
          <div className="max-w-[70%]">
            <div className="flex items-center mb-1 ml-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3">
              <div className="space-y-2">
                <div className="h-4 w-72 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="h-4 w-56 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center justify-end mt-1">
                <div className="h-3 w-12 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de saisie skeleton */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="w-full h-11 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bouton pièce jointe skeleton */}
            <div className="w-11 h-11 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            {/* Bouton envoi skeleton */}
            <div className="w-11 h-11 bg-blue-600/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Style pour l'animation smooth */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
