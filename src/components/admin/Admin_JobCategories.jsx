import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuPlus, LuSearch, LuTrash2 } from "react-icons/lu";
import adminApi from "@/api/adminApi";
import { useAuth } from "@/context/AuthContex";
import { toast } from "sonner";
import publicApi from "@/api/publicApi";

const Admin_JobCategories = () => {
  const { setLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);

  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateCategory = (value) => {
    if (!value) {
      setError("Category cannot be empty.");
      return false;
    }
    if (!/^[A-Za-z/ ]+$/.test(value)) {
      setError(
        "Category can contain only letters, spaces, and forward slashes."
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!validateCategory(newCategory)) return;

    setLoading(true);
    try {
      await adminApi.post("/add-category", { category: newCategory });
      const response = await publicApi.get("/categories");
      setCategories(response.data);
      setNewCategory("");
      setIsDialogOpen(false);
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await publicApi.get("/categories");
      setCategories(response.data);
    } catch (error) {
      setFetchError("Failed to fetch categories");
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-lg">Loading categories...</p>
          {fetchError && (
            <div className="text-red-500">
              <p>{fetchError}</p>
              <Button
                onClick={fetchCategories}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <LuPlus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    validateCategory(e.target.value);
                  }}
                  placeholder="Enter category name"
                  required
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!!error || !newCategory}
              >
                Add Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Jobs Count</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.category}>
                <TableCell>{category.category}</TableCell>
                <TableCell>{category.jobCount}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Admin_JobCategories;
