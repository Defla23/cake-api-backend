import { Express } from "express";
import * as deliveryController from "../Controllers/delivery.controller";



export default function registerDeliveryRoutes(app: any) {
app.get("/delivery", deliveryController.getAllDeliveries);
app.get("/delivery/:id", deliveryController.getDeliveryById);
app.post("/delivery", deliveryController.scheduleDelivery);
app.put("/delivery/:id", deliveryController.updateDelivery);
app.delete("/delivery/:id", deliveryController.deleteDelivery);

}
