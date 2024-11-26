import axiosInstance from "../utils/axiosInstance"

export const getNotifications = async () => {
  const { data } = await axiosInstance.get("/notifications/")
  return data
}

export const updateNotification = async (dataBody) => {
  await axiosInstance.patch("/notifications/hasNotificationFalse", dataBody)
}
