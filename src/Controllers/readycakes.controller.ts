import { Request, Response } from "express";
import * as cakeService from "../service/readycakes.service";

export const getCakes = async (req: Request, res: Response) => {
  try {
    const cakes = await cakeService.listCakes();
    res.json(cakes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
/* by id*/
export const getCake = async (req: Request, res: Response) => {
  try {
    const cake = await cakeService.getCake(Number(req.params.id));
    res.json(cake);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const addCake = async (req: Request, res: Response) => {
  try {
    const newCake = await cakeService.createCake(req.body);
    res.status(201).json({ message: "Cake added successfully", newCake });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCake = async (req: Request, res: Response) => {
  try {
    const response = await cakeService.updateCake(
      Number(req.params.id),
      req.body,
    );
    res.json(response);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCake = async (req: Request, res: Response) => {
  try {
    const response = await cakeService.deleteCake(Number(req.params.id));
    res.json(response);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
