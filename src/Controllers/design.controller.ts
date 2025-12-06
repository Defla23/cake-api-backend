import { Request, Response } from "express";
import * as designService from "../service/design.service";

// Get all designs
export const getAllDesigns = async (req: Request, res: Response) => {
  try {
    const designs = await designService.listDesigns();
    res.status(200).json(designs ); // wrap in object
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


//  Get single design by ID
export const getDesign = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const design = await designService.findDesign(id);
    res.status(200).json(design);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

//  Create new design
export const createDesign = async (req: Request, res: Response) => {
  try {
    const {
      DesignName,
      Description,
      BaseFlavor,
      Availability,
      Size,
      ImageUrl,
      Category,
    } = req.body;

    await designService.addDesign(

      DesignName,
      Description,
      BaseFlavor,
      Availability,
      Size,
      ImageUrl,
      Category,

    );

    res.status(201).json({ message: "Cake design created successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

//  Update existing design
export const updateDesign = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const {
      DesignName,
      Description,
      BaseFlavor,
      Availability,
      Size,
      ImageUrl,
      Category,
    } = req.body;

    await designService.modifyDesign(
      id,

      DesignName,
      Description,
      BaseFlavor,
      Availability,
      Size,
      ImageUrl,
      Category,

    );

    res.status(200).json({ message: "Cake design updated successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete design
export const deleteDesign = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await designService.removeDesign(id);
    res.status(200).json({ message: "Cake design deleted successfully" });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
