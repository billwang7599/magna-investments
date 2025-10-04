"use client";
import React from "react";

export default function DashboardLoading() {
  return (
    <div className="max-w-3xl mx-auto py-10 flex flex-col gap-10 animate-pulse">
      <div className="flex flex-col gap-8">
        {/* Your Rounds Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="h-8 w-40 bg-gray-200 rounded" />
            <div className="h-10 w-44 bg-gray-100 rounded" />
          </div>
          <div className="bg-surface rounded-md border border-border p-8 mb-6">
            <div className="h-12 w-80 bg-gray-100 rounded mb-4" />
            <div className="h-10 w-32 bg-gray-100 rounded" />
          </div>
          <div className="bg-surface rounded-md border border-border p-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <ul className="space-y-4">
              <li className="h-10 w-full bg-gray-100 rounded" />
              <li className="h-10 w-full bg-gray-100 rounded" />
              <li className="h-10 w-full bg-gray-100 rounded" />
            </ul>
          </div>
        </div>
        {/* Invites Section */}
        <div>
          <div className="h-8 w-56 bg-gray-200 rounded mb-4" />
          <div className="bg-surface rounded-md border border-border p-8">
            <ul className="space-y-4">
              <li className="h-10 w-full bg-gray-100 rounded" />
              <li className="h-10 w-full bg-gray-100 rounded" />
              <li className="h-10 w-full bg-gray-100 rounded" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
