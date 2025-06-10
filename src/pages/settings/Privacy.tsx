import Loading from "@/components/ui/Loading";
import axiosInstance from "@/lib/plugins/axios";
import {
  Button,
  Typography,
  Divider,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Privacy = () => {
  const [openDisable, setOpenDisable] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  // const [count, setCount] = useState(5);
  const [DeleteConfirmTxt, setDeleteConfirmTxt] = useState<string | number>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDisable = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/user/disable");
      if (data && data == "ok sir") {
        localStorage.clear();
      }
    } catch (e) {
      console.log(e);
      toast.error("Error disabling account, please try later");
    } finally {
      setOpenDisable(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!openDelete) return;

    let x = 10;
    setDeleteConfirmTxt(x);

    const id = setInterval(() => {
      x--;
      if (x === 0) {
        clearInterval(id);
        setDeleteConfirmTxt("confirm delete");
      } else {
        setDeleteConfirmTxt(x);
      }
    }, 1000);

    return () => clearInterval(id); // cleanup
  }, [openDelete]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.delete("/user");
      if (data && data == "ok sir") {
        localStorage.clear();
      }
    } catch (e) {
      console.log(e);
      toast.error("Error deleteing account, please try later");
    } finally {
      setOpenDelete(false);
      setIsLoading(false);
    }
  };

  return (
    <Box className="w-full px-4 lg:px-0 max-w-3xl py-8">
      <Typography variant="h4" gutterBottom>
        Privacy and Data
      </Typography>
      <Typography variant="body1" className="text-gray-400">
        Manage your account visibility or choose to permanently delete it.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Disable Account Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Temporarily Disable Your Account</Typography>
        <Typography variant="body2" className="text-gray-400" sx={{ mt: 1 }}>
          This will make your account invisible. You can reactivate it by
          logging in again.
        </Typography>
        <Button
          variant="outlined"
          color="warning"
          sx={{ mt: 2 }}
          onClick={() => setOpenDisable(true)}
        >
          Disable Account
        </Button>
      </Box>

      {/* Delete Account Section */}
      <Box>
        <Typography variant="h4" color="error">
          Permanently Delete Your Account
        </Typography>
        <Typography variant="body2" className="text-gray-400" sx={{ mt: 1 }}>
          Warning: This action is irreversible. All data will be permanently
          erased.
        </Typography>
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={() => setOpenDelete(true)}
        >
          Delete Account
        </Button>
      </Box>

      {/* Disable Confirmation Dialog */}
      <Dialog open={openDisable} onClose={() => setOpenDisable(false)}>
        <DialogTitle>Disable Account</DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-400">
            Are you sure you want to temporarily disable your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDisable(false)}>Cancel</Button>
          <Button onClick={handleDisable} color="warning" variant="contained">
            {!isLoading ? "Confirm Disable" : <Loading />}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-400">
            This will permanently remove your account and all associated data.
            This action cannot be undone. Are you absolutely sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            className="w-36 text-white"
            disabled={typeof DeleteConfirmTxt !== "string"}
          >
            {!isLoading ? DeleteConfirmTxt : <Loading />}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Privacy;
