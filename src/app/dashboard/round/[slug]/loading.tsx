"use client";
import React from "react";

export default function LoadingRoundDetails() {
  return (
    <div className="max-w-3xl mx-auto py-10 flex flex-col gap-10 animate-pulse">
      <div className="bg-surface rounded-md border border-border p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-100 rounded mb-1" />
              <div className="h-6 w-40 bg-gray-100 rounded" />
            </div>
            <div className="flex flex-col gap-2 min-w-[220px]">
              <div className="flex items-center gap-2">
                <span className="h-4 w-16 bg-gray-100 rounded" />
                <span className="h-6 w-24 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-16 bg-gray-100 rounded" />
                <span className="h-6 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-56 bg-gray-100 rounded" />
            <div className="h-4 w-56 bg-gray-100 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="bg-gray-100 rounded-md p-4 border border-border flex flex-col h-20" />
            <div className="bg-gray-100 rounded-md p-4 border border-border flex flex-col h-20" />
            <div className="bg-gray-100 rounded-md p-4 border border-border flex flex-col h-20" />
          </div>
          <div className="mt-6">
            <div className="h-10 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
            <ul className="mb-4 space-y-2">
              <li className="h-6 w-64 bg-gray-100 rounded" />
              <li className="h-6 w-64 bg-gray-100 rounded" />
              <li className="h-6 w-64 bg-gray-100 rounded" />
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-surface rounded-md border border-border p-8">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-40 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
