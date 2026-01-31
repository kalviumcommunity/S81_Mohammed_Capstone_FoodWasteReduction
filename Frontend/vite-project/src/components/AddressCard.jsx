import React from "react";
import { FaMapMarker, FaTrash } from "react-icons/fa";

export default function AddressCard({ _id, street, city, state, postalCode, country, isDefault, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="mt-1 text-lg text-blue-600">
            <FaMapMarker />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{street}</div>
            <div className="text-sm text-gray-600">
              {city}, {state} {postalCode}
            </div>
            <div className="text-sm text-gray-500">{country}</div>
            {isDefault && (
              <div className="mt-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                Default Address
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(_id)}
          className="text-gray-400 transition hover:text-red-600"
          aria-label="Delete address"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
