import { Request, Response } from "express";

import * as DeliveryService from "../service/delivery.service";
import { error } from "console";

export const getAllDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveries = await DeliveryService.getAllDelivereries();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries", error });
  }
};

export const getDeliveryById = async (req: Request, res: Response) => {
  const deliveryId = parseInt(req.params.id);
  try {
    const delivery = await DeliveryService.getDeliveryById(deliveryId);
    if(!delivery){
      return res.status(404).json({message:"Delivery not found"})
    }else{
         res.status(200).json({data:delivery})
    }     
  } catch (error:any) {   
    res.status(500).json({message:"Internal server error",error})
  }
};


export const scheduleDelivery = async (req: Request, res: Response) => {
  const deliveryData = req.body;
  try {
   const delivery = await DeliveryService.scheduleDelivery(deliveryData);
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Error scheduling delivery", error });
  }
};

export const updateDelivery = async (req: Request, res: Response) => {
  const deliveryId = parseInt(req.params.id);
  const deliveryData = req.body;
  try {
    await DeliveryService.updateDelivery(deliveryId, deliveryData);
    res.json({ message: "Delivery updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating delivery", error });
  }
};

export const deleteDelivery = async (req: Request, res: Response) => {
  const deliveryId = parseInt(req.params.id);
  try {
    await DeliveryService.deleteDelivery(deliveryId);
    res.json({ message: "Delivery deleted successfully" });
  } catch (error:any) {
    if(error.message === "Delivery not found"){
      return res.status(404).json({message:"Delivery not found"})
    }
    res.status(500).json({ message: "Error deleting delivery"});
  }
};