import * as designRepo from "../repositories/design.repository";

//  Fetch all designs
export const listDesigns = async () => {
  return await designRepo.getAllDesigns();
};

//  Find design by ID
export const findDesign = async (id: number) => {
  const design = await designRepo.getDesignById(id);
  if (!design) throw new Error("Design not found");
  return design;
};

//  Create design
export const addDesign = async (
  designName: string,
  description: string,
  baseFlavor: string,
  availability: number,
  size: string,
  imageUrl: string,
  category: string,
) => {
  if (!designName || !baseFlavor || !size) {
    throw new Error("Design name, base flavor, and size are required");
  }

  await designRepo.createDesign(
    designName,
    description,
    baseFlavor,
    availability,
    size,
    imageUrl,
    category,
  );
};

//  Update design
export const modifyDesign = async (
  id: number,
  designName: string,
  description: string,
  baseFlavor: string,
  availability: number,
  size: string,
  imageUrl: string,
  category: string,
) => {
  const existing = await designRepo.getDesignById(id);
  if (!existing) throw new Error("Design not found");

  await designRepo.updateDesign(
    id,
    designName,
    description,
    baseFlavor,
    availability,
    size,
    imageUrl,
    category,
  );
};

//  Delete design
export const removeDesign = async (id: number) => {
  const existing = await designRepo.getDesignById(id);
  if (!existing) throw new Error("Design not found");
  await designRepo.deleteDesign(id);
};
