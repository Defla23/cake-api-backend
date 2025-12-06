import { getPool } from "../db/config";
import { Delivery, DeliveryUpdate } from "../types/delivery.types";

export const getAllDeliveries = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM Deliveries");
  return result.recordset;
};

export const getDeliveryById = async(DeliveryID:number)=>{
  const pool=await getPool()
  const results = await pool
  .request()
  .input("DeliveryID",DeliveryID)
  .query("SELECT * FROM Deliveries WHERE DeliveryID=@DeliveryID")

  return results.recordset[0];
}

export const createDelivery = async (delivery: Delivery)=> {
  const pool = await getPool();
  await pool
    .request()
    .input("OrderId", delivery.OrderId)
    .input("DeliveryAddress", delivery.DeliveryAddress)
    .input("DeliveryDate", delivery.DeliveryDate)
    .input("CourierName", delivery.CourierName)
    .input("CourierContact", delivery.CourierContact)
    .input("Status", delivery.Status)
    .query(
      "INSERT INTO Deliveries (OrderId, DeliveryAddress, DeliveryDate, CourierName, CourierContact, Status) VALUES (@OrderId, @DeliveryAddress, @DeliveryDate, @CourierName, @CourierContact, @Status)",
    );
  return {message:"Delivery scheduled successfully"};
};

export const updateDelivery = async (DeliveryID: number, delivery: DeliveryUpdate ,
)=> {
  const pool = await getPool();
  await pool
    .request()
    .input("DeliveryID", DeliveryID)
    .input("DeliveryDate", delivery.DeliveryDate)
    .input("DeliveryAdrress",delivery.DeliveryAddress)
    .input("CourierName",delivery.CourierName)
    .input("CourierContact",delivery.CourierContact)
    .input("Status", delivery.Status)
    .query("UPDATE Deliveries SET DeliveryDate = @DeliveryDate, DeliveryAddress=@DeliveryAdrress, CourierName=@CourierName, CourierContact=@CourierContact, Status = @Status WHERE DeliveryID = @DeliveryID");

    return {message:"Delivery updated successfully"};
};

export const deleteDelivery = async (DeliveryID: number)=> {
  const pool = await getPool();
  await pool
    .request()
    .input("DeliveryID", DeliveryID)
    .query("DELETE FROM Deliveries WHERE DeliveryID = @DeliveryID");
    return {message:"Delivery deleted successfully"};
};
