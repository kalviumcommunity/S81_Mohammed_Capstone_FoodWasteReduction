import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaCamera, FaPlus } from "react-icons/fa";
import CreateAddress from "../components/CreateAddress";
import AddressCard from "../components/AddressCard";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";


export default function Profile() {
	const navigate = useNavigate();
	const [personalDetails, setPersonalDetails] = useState({
		name: "",
		email: "",
		phoneNumber: "",
		avatarUrl: "",
		profilePhoto: "",
	});
	const [addresses, setAddresses] = useState([]);
	const [addAddress, setAddAddress] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let isMounted = true;
		
		const fetchUserData = async () => {
			try {
				// Add a small delay to ensure cookie is set
				await new Promise(resolve => setTimeout(resolve, 100));
				
				const res = await fetch(
					API_ENDPOINTS.CHECK_LOGIN,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include"
					}
				);
				
				if (!res.ok) {
					if (res.status === 401) {
						if (isMounted) navigate('/login');
					}
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				
				const data = await res.json();
				if (isMounted && data) {
					setPersonalDetails(data.message);
					setAddresses(data.message.address || []);
					setLoading(false);
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
				if (isMounted) {
					setError("Failed to load profile");
					setLoading(false);
				}
			}
		};
		
		fetchUserData();
		
		return () => {
			isMounted = false;
		};
	}, [navigate]);


	const changeProfilePhoto = async (e) => {
		const file = e.target.files[0];

		if (!file) {
			alert("Please select a file");
			return;
		}

		const multiPartFormData = new FormData();
		multiPartFormData.append("photo", file);

		setUploading(true);

		try {
			const response = await axios.post(
				API_ENDPOINTS.UPLOAD_PHOTO,
				multiPartFormData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					withCredentials: true
				}
			);

			if (response.status === 200) {
				setPersonalDetails({
					...personalDetails,
					profilePhoto: response.data.message.profilePhoto,
				});
				alert("Photo uploaded successfully!");
				e.target.value = ""
			}
		} catch (error) {
			console.error("Upload Error:", error.response?.data || error.message);

			if (error.response?.status === 401) {
				alert("Your session has expired. Please login again.");
				Cookies.remove('accesstoken');
				navigate('/login');
			} else {
				alert(error.response?.data?.message || "Failed to upload photo. Please try again.");
			}
		} finally {
			setUploading(false);
		}
	};

	const deleteAddress = async (addressId) => {
					if (!window.confirm("Are you sure you want to delete this address?")) return;
					
					try {
						const response = await axios.delete(
							API_ENDPOINTS.DELETE_ADDRESS(addressId),
							{ withCredentials: true }
						);
						if (response.status === 200) {
							setAddresses(addresses.filter(addr => addr._id !== addressId));
							alert("Address deleted successfully");
						}
					} catch (error) {
						console.error("Delete error:", error.response?.data || error.message);
						
						if (error.response?.status === 401) {
							alert("Your session has expired. Please login again.");
							Cookies.remove('accesstoken');
							navigate('/login');
						} else {
							alert(error.response?.data?.message || "Failed to delete address");
						}
					}
				};

	const refreshAddresses = async () => {
					try {
						const response = await fetch(
							API_ENDPOINTS.CHECK_LOGIN,
							{
								method: "GET",
								headers: {
									"Content-Type": "application/json",
								},
								credentials: "include"
							}
						);
						if (response.ok) {
							const data = await response.json();
							setAddresses(data.message.address || []);
							setPersonalDetails(data.message);
						}
					} catch (error) {
						console.error("Refresh error:", error);
					}
				};

				return (
					<div className="min-h-screen bg-gray-50 py-8 px-4">
						<div className="mx-auto w-full max-w-6xl space-y-6">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
					<p className="text-sm text-gray-500">Manage your personal information and delivery addresses.</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
									<div className="flex items-center gap-3">
					<div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
						<FaCamera />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-900">Profile Photo</h2>
						<p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
					</div>
				</div>

				<div className="mt-6 flex flex-col items-center gap-4">
					<div className="relative">
						<img
						src={personalDetails.profilePhoto ? API_ENDPOINTS.PROFILE_PHOTO(personalDetails.profilePhoto) : undefined}
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = `data:image/png;base64,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`;
						}}
						alt="profile"
						className="h-40 w-40 rounded-full object-cover ring-4 ring-white"
					/>
					{uploading ? (
						<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs font-semibold text-white">
							Uploading...
						</div>
					) : null}
				</div>

				<label
					htmlFor="upload"
					className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
				>
					<FaCamera className="text-gray-500" />
					Update Photo
				</label>
				<input id="upload" type="file" className="hidden" onChange={changeProfilePhoto} />
			</div>
		</div>

		<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
			<div className="flex items-center gap-3">
				<div className="rounded-full bg-blue-50 p-2 text-blue-600">
					<FaUser />
				</div>
				<h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="rounded-xl border border-gray-100 p-4">
					<div className="flex items-center gap-2 text-sm font-medium text-gray-500">
						<FaUser className="text-emerald-500" />
						Full Name
					</div>
					<div className="mt-2 text-base font-semibold text-gray-900">
						{personalDetails.name || "—"}
					</div>
				</div>
				<div className="rounded-xl border border-gray-100 p-4">
					<div className="flex items-center gap-2 text-sm font-medium text-gray-500">
						<FaEnvelope className="text-emerald-500" />
						Email Address
					</div>
					<div className="mt-2 text-base font-semibold text-gray-900 break-all">
						{personalDetails.email || "—"}
					</div>
				</div>
				<div className="rounded-xl border border-gray-100 p-4">
					<div className="flex items-center gap-2 text-sm font-medium text-gray-500">
						<FaPhone className="text-emerald-500" />
						Phone Number
					</div>
					<div className="mt-2 text-base font-semibold text-gray-900">
						{personalDetails.phoneNumber || "—"}
					</div>
				</div>
				<div className="rounded-xl border border-gray-100 p-4">
					<div className="flex items-center gap-2 text-sm font-medium text-gray-500">
						<FaMapMarker className="text-emerald-500" />
						Default Location
					</div>
					<div className="mt-2 text-base font-semibold text-gray-900">
						{addresses?.[0]?.city || "Not set"}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-3">
				<div className="rounded-full bg-purple-50 p-2 text-purple-600">
					<FaMapMarker />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-gray-900">Addresses</h2>
					<p className="text-xs text-gray-500">Manage your saved delivery locations.</p>
				</div>
			</div>
			<button
				onClick={() => setAddAddress(!addAddress)}
				className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
			>
				<FaPlus />
				{addAddress ? "Close" : "Add Address"}
			</button>
		</div>

		<div className="mt-6 space-y-4">
			{addresses.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
					No addresses found. Add a new address to get started.
				</div>
			) : null}
			{addresses.map((address) => (
				<AddressCard key={address._id} {...address} onDelete={deleteAddress} />
			))}
		</div>
	</div>

	{addAddress && <CreateAddress onAddressAdded={refreshAddresses} onClose={() => setAddAddress(false)} />}
</div>
</div>
	);
}