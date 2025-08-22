import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
    Alert,
} from "@mui/material";
import { listenForFarms, saveDashboardToFirestore, updateDashboardInFirestore } from "../../../services/firebase/dataService";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../../../services/firebase/config";

const SaveDialog = ({ open, onClose, onSave, currentFileName = "", userId = "", existingDashboard = null }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingToFirestore, setSavingToFirestore] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fileName: "",
    title: "",
    farmId: "",
    farmName: "",
    description: "",
    filepath: "",
    userId: "",
  });

  // Generate unique random filename and fetch farms when dialog opens
  useEffect(() => {
    if (open) {
      if (existingDashboard) {
        // Pre-populate form with existing dashboard data
        setFormData({
          fileName: existingDashboard.fileName || "",
          title: existingDashboard.title || "",
          farmId: existingDashboard.farmId || "",
          farmName: existingDashboard.farmName || "",
          description: existingDashboard.description || "",
          filepath: existingDashboard.filepath || "",
          userId: userId
        });
      } else {
        // Generate new filename for new dashboard
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const uniqueFileName = `dashboard_${timestamp}_${random}.joint`;
        
        setFormData(prev => ({
          ...prev,
          fileName: uniqueFileName,
          userId: userId
        }));
      }

      // Fetch farms from realtime database
      setLoading(true);
      const unsubscribe = listenForFarms((farmsData) => {
        if (farmsData) {
          // Convert object to array format for easier handling
          const farmsArray = Object.entries(farmsData).map(([id, farm]) => ({
            id,
            name: farm.name || farm.title || id,
            ...farm
          }));
          setFarms(farmsArray);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [open, userId, existingDashboard]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    
    try {
      // Step 1: Get dashboard data from parent component
      const dashboardData = await onSave(formData);
      
      console.log('dashboardData', dashboardData);
      if (dashboardData) {
        // Step 2: Upload to storage and get download URL
        setUploading(true);
        const downloadURL = await uploadDashboardToStorage(dashboardData.graph);
        setUploading(false);
        
        // Update form data with the download URL
        const updatedFormData = {
          ...formData,
          farmName: getFarmName(formData.farmId),
          filepath: downloadURL
        };
        
        console.log("Dashboard saved successfully with download URL:", downloadURL);
        
        // Step 3: Save metadata to Firestore (update existing or create new)
        setSavingToFirestore(true);
        const firestoreData = {
          ...updatedFormData,
          version: dashboardData.version || "1.0",
          timestamp: dashboardData.timestamp || new Date().toISOString()
        };
        
        let firestoreId;
        if (existingDashboard && dashboardData.isUpdate) {
          // Update existing dashboard
          firestoreId = await updateDashboardInFirestore(existingDashboard.id, firestoreData);
          console.log("Dashboard updated in Firestore with ID:", firestoreId);
        } else {
          // Create new dashboard
          firestoreId = await saveDashboardToFirestore(firestoreData);
          console.log("Dashboard saved to Firestore with ID:", firestoreId);
        }
        setSavingToFirestore(false);
        
        // Step 4: Show success message
        const successMessage = existingDashboard && dashboardData.isUpdate 
          ? `Dashboard "${formData.title}" updated successfully!`
          : `Dashboard "${formData.title}" saved successfully!`;
        
        setSuccess(successMessage);
        
        // Wait a moment to show success message, then close
        setTimeout(() => {
          // Call onSave again with the complete data including filepath and Firestore ID
          const finalData = {
            ...updatedFormData,
            firestoreId: firestoreId,
            isUpdate: existingDashboard && dashboardData.isUpdate
          };
          
          onSave(finalData);
          onClose();
        }, 1500);
      } else {
        setError("Failed to get dashboard data");
      }
    } catch (error) {
      console.error('Save failed:', error);
      setError(`Save failed: ${error.message}`);
      // Reset loading states on error
      setUploading(false);
      setSavingToFirestore(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fileName: "",
      title: "",
      farmId: "",
      farmName: "",
      description: "",
      filepath: "",
      userId: "",
    });
    setFarms([]);
    setError("");
    setSuccess("");
    onClose();
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        fileName: "",
        title: "",
        farmId: "",
        farmName: "",
        description: "",
        filepath: "",
        userId: "",
      });
      setError("");
      setSuccess("");
    }
  }, [open]);

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.id === farmId);
    return farm ? farm.name : farmId;
  };

  const uploadDashboardToStorage = async (dashboardData) => {
    try {
      setError("");
      
      // Use existing storage path if updating, otherwise create new path
      const storagePath = existingDashboard && dashboardData.isUpdate 
        ? existingDashboard.storagePath 
        : `diagrams/${formData.farmId}/${formData.fileName}`;
      
      const storageRef = ref(storage, storagePath);
      
      // Upload the dashboard data as a string
      await uploadString(storageRef, JSON.stringify(dashboardData), 'raw');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading dashboard:', error);
      setError(`Upload failed: ${error.message}`);
      throw error;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {existingDashboard ? 'Edit Dashboard' : 'Save Dashboard'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {/* Progress indicator */}
        {(uploading || savingToFirestore) && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="info.main">
                {uploading ? 'Uploading file to storage...' : 'Saving data to database...'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {uploading ? 'Please wait while your dashboard is being uploaded.' : 'Please wait while your dashboard is being saved.'}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter dashboard title"
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Farm</InputLabel>
            <Select
              value={formData.farmId}
              label="Farm"
              onChange={(e) => handleInputChange('farmId', e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">
                <em>Select a farm</em>
              </MenuItem>
              {loading ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    Loading farms...
                  </Box>
                </MenuItem>
              ) : farms.length === 0 ? (
                <MenuItem disabled>
                  No farms available
                </MenuItem>
              ) : (
                farms.map((farm) => (
                  <MenuItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter dashboard description"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!formData.title.trim() || uploading || savingToFirestore}
        >
          {uploading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              Uploading...
            </Box>
          ) : savingToFirestore ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              Saving...
            </Box>
          ) : (
            existingDashboard ? 'Update' : 'Save'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDialog;
