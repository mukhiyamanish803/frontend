import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuSearch, LuEye, LuChevronDown } from "react-icons/lu";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import adminApi from "@/api/adminApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "ACTIVE",
    label: "Active",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "SUSPEND",
    label: "Suspend",
    color: "bg-red-100 text-red-800",
  },
];

function getStatusOption(status) {
  return (
    STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0]
  );
}

const RegisteredCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [updateStatus, setUpdateStatus] = useState("PENDING");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [detailCompany, setDetailCompany] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.get("/companies");
      setCompanies(response.data);
    } catch (error) {
      toast.error("Failed to fetch companies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter companies by search term and updateStatus
  const filteredCompanies = companies.filter(
    (company) =>
      (updateStatus === "ALL" ||
        (company.status || "").toUpperCase() === updateStatus) &&
      (company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.businessEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusChange = async (companyId, newStatus) => {
    try {
      await adminApi.patch(`/company/${companyId}/${newStatus}`);
      toast.success("Company status updated successfully");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to update company status");
    }
  };

  // Modern UI styles
  const cellBase =
    "py-4 px-6 whitespace-nowrap text-sm font-medium transition-colors";
  const headBase =
    "px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider";

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-lg">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Card className="shadow-lg rounded-xl border border-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Registered Companies
              </CardTitle>
              <CardDescription className="text-gray-500">
                Manage all registered companies in the platform
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {/* Status Filter Dropdown */}
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="rounded-lg border-gray-200 px-3 py-2 text-sm"
              >
                <option value="ALL">All Statuses</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="relative">
                <LuSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg border-gray-200"
                />
              </div>
              <Button variant="outline" onClick={fetchCompanies}>
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-b-xl">
            <Table className="min-w-full bg-white">
              <TableHeader>
                <TableRow>
                  <TableHead className={headBase}>Logo</TableHead>
                  <TableHead className={headBase}>Company Name</TableHead>
                  <TableHead className={headBase}>Email</TableHead>
                  <TableHead className={headBase}>Status</TableHead>
                  <TableHead className={headBase}>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-gray-400"
                    >
                      No companies found.
                    </TableCell>
                  </TableRow>
                )}
                {filteredCompanies.map((company) => (
                  <TableRow
                    key={company.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <TableCell className={cellBase}>
                      <div className="flex items-center">
                        {company.logo ? (
                          <img
                            src={company.logo.fileUrl}
                            alt={company.companyName}
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={cellBase}>
                      <span className="text-gray-900 font-semibold">
                        {company.companyName}
                      </span>
                    </TableCell>
                    <TableCell className={cellBase}>
                      <span className="text-gray-700">
                        {company.businessEmail}
                      </span>
                    </TableCell>
                    <TableCell className={cellBase}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`flex items-center gap-2 px-3 rounded-full border ${
                              getStatusOption(
                                (company.status || "").toUpperCase()
                              ).color
                            } border-transparent hover:border-gray-300`}
                          >
                            <span className="capitalize">
                              {
                                getStatusOption(
                                  (company.status || "").toUpperCase()
                                ).label
                              }
                            </span>
                            <LuChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {STATUS_OPTIONS.map((opt) => (
                            <DropdownMenuItem
                              key={opt.value}
                              onClick={() =>
                                handleStatusChange(company.id, opt.value)
                              }
                              className={`flex items-center gap-2 ${opt.color} rounded-full my-2 justify-center`}
                            >
                              <span className="capitalize">{opt.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className={cellBase}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-3 py-1 flex items-center gap-2"
                        onClick={() => setDetailCompany(company)}
                      >
                        <LuEye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <AlertDialog
        open={!!detailCompany}
        onOpenChange={() => setDetailCompany(null)}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Company Details</AlertDialogTitle>
            <AlertDialogDescription>
              {detailCompany && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-3">
                    {detailCompany.logo ? (
                      <img
                        src={detailCompany.logo.fileUrl}
                        alt={detailCompany.companyName}
                        className="h-12 w-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-lg">
                        {detailCompany.companyName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {detailCompany.industryType}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Email: </span>
                    <span>{detailCompany.businessEmail}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Phone: </span>
                    <span>{detailCompany.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Address: </span>
                    <span>{detailCompany.address}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Status: </span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        getStatusOption(
                          (detailCompany.status || "").toUpperCase()
                        ).color
                      }`}
                    >
                      {
                        getStatusOption(
                          (detailCompany.status || "").toUpperCase()
                        ).label
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Active Candidates: </span>
                    <span>{detailCompany.activeCandidate || 0}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Hired: </span>
                    <span>{detailCompany.hired || 0}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Jobs Posted: </span>
                    <span>{detailCompany.jobCount || 0}</span>
                  </div>
                  {/* Add more fields as needed */}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegisteredCompanies;
