import * as ordersService from "../service/orders.service";

import { Request, Response } from "express";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await ordersService.fetchAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id, 10);
  try {
    const order = await ordersService.fetchOrderById(orderId);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = await ordersService.createNewOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOrderDetails = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  const orderData = req.body;

  try {
    const updatedOrder = await ordersService.modifyOrderDetails(
      orderId,
      orderData,
    );
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    if (error.message === "Order not found") {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json({ error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  console.log("order id", orderId);
  const { Status } = req.body;
  console.log(Status);
  try {
    await ordersService.changeOrderStatus(orderId, Status);

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error: any) {
    if (error.message === "Order not found") {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json(error);
  }
};

export const getOrdersByuserid = async (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);
  try {
    const orders = await ordersService.getOrdersByuserid(userid);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  try {
    await ordersService.removeOrder(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error: any) {
    if (error.message === "Order not found") {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json(error);
  }
};

export const fetchOrdersofUser = async (req: Request, res: Response) => {
  const userid = parseInt(req.params.UserId);
  try {
    const orders = await ordersService.fetchOrdersofUser(userid);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders of user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
