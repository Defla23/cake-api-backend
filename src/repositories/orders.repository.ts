import sql from "mssql";
import { getPool } from "../db/config";
import { NewOrder, updateOrder } from "../types/orders.types";

export const getAllOrders = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM Cake_Orders");
  return result.recordset;
};

export const getOrderById = async (orderId: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("Id", sql.Int, orderId)
    .query("SELECT * FROM Cake_Orders WHERE Id = @Id");
  return result.recordset[0];
};

export const createOrder = async (orderData: NewOrder) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("DesignID", orderData.DesignID ?? null)
    .input("userid", sql.Int, orderData.userid)
    .input("Size", sql.VarChar(50), orderData.Size)
    .input("Flavor", sql.VarChar(100), orderData.Flavor)
    .input("Message", sql.VarChar(255), orderData.Message ?? null)
    .input("Status", sql.VarChar(50), orderData.Status ?? "Pending")
    .input("DeliveryDate", sql.DateTime, orderData.DeliveryDate)
    .input("Notes", sql.VarChar(sql.MAX), orderData.Notes ?? null)
    .input(
      "ExtendedDescription",
      sql.VarChar(sql.MAX),
      orderData.ExtendedDescription ?? null,
    )
    .input(
      "SampleImages",
      sql.NVarChar(sql.MAX),
      orderData.SampleImages ? JSON.stringify(orderData.SampleImages) : null,
    )
    .input(
      "ColorPreferences",
      sql.NVarChar(sql.MAX),
      orderData.ColorPreferences
        ? JSON.stringify(orderData.ColorPreferences)
        : null,
    )
    .query(
      "INSERT INTO Cake_Orders (DesignID, userid,Size, Flavor, Message, Status, DeliveryDate, Notes, ExtendedDescription, SampleImages, ColorPreferences)VALUES (@DesignID, @userid, @Size, @Flavor, @Message, @Status, @DeliveryDate, @Notes, @ExtendedDescription, @SampleImages, @ColorPreferences)",
    );
  return result.recordset;
};

export const updateOrderStatus = async (orderId: number, Status: string) => {
  const pool = await getPool();
  await pool
    .request()
    .input("Id", orderId)
    .input("Status", Status)
    .query("UPDATE Cake_Orders SET Status = @Status WHERE Id = @Id");
  return "Order status updated";
};

export const updateOrderDetails = async (
  orderId: number,
  orderData: Partial<updateOrder>,
) => {
  const pool = await getPool();
  await pool;
  const existingOrder = await getOrderById(orderId);
  if (!existingOrder) {
    throw new Error("Order not found");
  }
  const updatedOrder = { ...existingOrder, ...orderData };

  await pool
    .request()
    .input("Id", orderId)
    .input("DesignID", updatedOrder.DesignID)
    .input("Size", updatedOrder.Size)
    .input("Flavor", updatedOrder.Flavor)
    .input("Message", updatedOrder.Message)
    .input("ExtendedDescription", updatedOrder.ExtendedDescription)
    .input("Notes", updatedOrder.Notes)
    .input("SampleImages", updatedOrder.SampleImages)
    .input("ColorPreferences", updatedOrder.ColorPreferences)
    .query(
      "UPDATE Cake_Orders SET DesignID = @DesignID, Size = @Size, Flavor = @Flavor, Message = @Message, ExtendedDescription = @ExtendedDescription, Notes = @Notes, SampleImages = @SampleImages, ColorPreferences = @ColorPreferences WHERE Id = @Id",
    );
  return "Order details updated";
};

export const deleteOrder = async (orderId: number) => {
  const pool = await getPool();
  await pool
    .request()
    .input("Id", orderId)
    .query("DELETE FROM Cake_Orders WHERE Id = @Id");
  return "Order deleted";
};

export const getOrdersByuserid = async (userid: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("userid", userid)
    .query("SELECT * FROM Cake_Orders WHERE userid = @userid");
  return result.recordset;
};

export const fetchOrdersofUser = async (userid: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("userid", userid)
    .query(
      "SELECT  u.name, u.email, u.phone, u.address, o.* FROM Users u LEFT JOIN Cake_Orders o ON o.userid = u.userid",
    );
  if (result.recordset.length === 0) {
    return { message: "No orders found" };
  }
  return result.recordset;
};
