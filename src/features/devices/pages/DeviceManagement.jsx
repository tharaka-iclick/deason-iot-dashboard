import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Wifi, WifiOff } from "lucide-react";
import { Button, Card, Modal, Input } from "../../../shared/components/ui";
import { fetchDevices, addDevice } from "../store/devicesSlice";
import { useForm } from "react-hook-form";
import "./DeviceManagement.css";

export const DeviceManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { devices, loading } = useSelector((state) => state.devices);
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      dispatch(fetchDevices(user.uid));
    }
  }, [dispatch, user]);

  const onSubmit = async (data) => {
    await dispatch(addDevice({ userId: user.uid, device: data }));
    setShowModal(false);
    reset();
  };

  const getStatusIcon = (status) => {
    return status === "online" ? (
      <Wifi className="status-icon online" size={16} />
    ) : (
      <WifiOff className="status-icon offline" size={16} />
    );
  };

  return (
    <div className="device-management">
      <div className="page-header">
        <h1>Device Management</h1>
        <Button onClick={() => setShowModal(true)} icon={Plus}>
          Add Device
        </Button>
      </div>

      <div className="devices-grid">
        {devices.map((device) => (
          <Card key={device.id} className="device-card">
            <div className="device-header">
              <h3>{device.name}</h3>
              {getStatusIcon(device.status)}
            </div>
            <p className="device-type">{device.type}</p>
            <p className="device-location">{device.location}</p>
            <div className="device-actions">
              <Button variant="outline" size="small">
                Configure
              </Button>
              <Button variant="outline" size="small">
                View Data
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Device"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="device-form">
          <Input
            label="Device Name"
            {...register("name", { required: "Device name is required" })}
            error={errors.name?.message}
          />

          <Input
            label="Device Type"
            {...register("type", { required: "Device type is required" })}
            error={errors.type?.message}
          />

          <Input
            label="Location"
            {...register("location", { required: "Location is required" })}
            error={errors.location?.message}
          />

          <Input
            label="Description"
            as="textarea"
            {...register("description")}
          />

          <div className="modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Device
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
