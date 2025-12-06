import * as DeliveryRepository from "../repositories/deliveries.repository";
import { Delivery } from "../types/delivery.types";

export const getAllDelivereries = async () => {
  const deliveries = await DeliveryRepository.getAllDeliveries();
  return deliveries
}

export const getDeliveryById = async (deliveryId: number) => {
   return await DeliveryRepository.getDeliveryById(deliveryId); 
}

export const scheduleDelivery = async (delivery: Delivery) => {
  return await DeliveryRepository.createDelivery(delivery);
}

export const updateDelivery = async (DeliveryID: number, delivery: Delivery) => {
  const existingDelivery = await DeliveryRepository.getDeliveryById(DeliveryID);
  if (!existingDelivery) {
    throw new Error("Delivery not found");
  }
  const updatedDelivery = { ...existingDelivery, ...delivery };
  return await DeliveryRepository.updateDelivery(DeliveryID, updatedDelivery);  
}

export const deleteDelivery = async (id: number) => {
  const existingDelivery =await DeliveryRepository.getDeliveryById(id);
  if (!existingDelivery) {
    throw new Error("Delivery not found");
  }
  return await DeliveryRepository.deleteDelivery(id);
}
