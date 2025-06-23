import adminApi from "@/api/adminApi";
import { useAuth } from "@/context/AuthContex";
import React, { useEffect, useState } from "react";
import { LuPlus, LuTrash, LuX, LuSearch } from "react-icons/lu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import publicApi from "@/api/publicApi";

const DialCode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dialCodes, setDialCodes } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDialCode, setNewDialCode] = useState({
    countryName: "",
    countryCode: "",
    dialCode: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDialCodes = dialCodes.filter((country) =>
    Object.values(country)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await adminApi.post("/add-dial-code", newDialCode);
      const updatedResponse = await publicApi.get("/dial-code");
      setDialCodes(updatedResponse.data);
      setIsModalOpen(false);
      setNewDialCode({ countryName: "", countryCode: "", dialCode: "" });
    } catch (err) {
      setError(err.message || "Failed to add dial code");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (country) => {
    try {
      setDeleteLoading(true);
      await adminApi.delete("/remove-dial-code", {
        data: {
          countryName: country.countryName,
          countryCode: country.countryCode,
          dialCode: country.dialCode,
        },
      });

      const response = await publicApi.get("/dial-code");
      setDialCodes(response.data);
      setError(null);
      setCountryToDelete(null);
    } catch (err) {
      setError(err.message || "Failed to delete dial code");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchDialCodes = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get("/dial-code");
        setDialCodes(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch dial codes");
      } finally {
        setLoading(false);
      }
    };
    fetchDialCodes();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dial Codes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          <LuPlus className="h-5 w-5" />
          Add Dial Code
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by country name, code or dial code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Dial Code</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country Name
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={newDialCode.countryName}
                    onChange={(e) =>
                      setNewDialCode({
                        ...newDialCode,
                        countryName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={newDialCode.countryCode}
                    onChange={(e) =>
                      setNewDialCode({
                        ...newDialCode,
                        countryCode: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dial Code
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={newDialCode.dialCode}
                    onChange={(e) =>
                      setNewDialCode({
                        ...newDialCode,
                        dialCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country Code
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dial Code
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDialCodes.map((country) => (
              <tr key={country.dialCode}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {country.countryName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {country.countryCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {country.dialCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => setCountryToDelete(country)}
                    disabled={deleteLoading}
                  >
                    <LuTrash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={!!countryToDelete}
        onOpenChange={() => setCountryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              dial code for {countryToDelete?.countryName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(countryToDelete)}
              disabled={deleteLoading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DialCode;
