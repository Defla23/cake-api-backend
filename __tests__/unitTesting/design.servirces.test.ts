import * as designRepo from "../../src/repositories/design.repository";
import * as designService from "../../src/service/design.service";

// Mock all repository methods
jest.mock("../../src/repositories/design.repository");

describe("Design Service", () => {
  const mockDesign = {
    id: 1,
    designName: "Chocolate Delight",
    description: "Rich chocolate base with frosting",
    baseFlavor: "Chocolate",
    availability: 1,
    size: "Medium",
    imageUrl: "chocolate.jpg",
    category: "Birthday",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // listDesigns
  it("should return all designs", async () => {
    (designRepo.getAllDesigns as jest.Mock).mockResolvedValue([mockDesign]);

    const result = await designService.listDesigns();

    expect(result).toEqual([mockDesign]);
    expect(designRepo.getAllDesigns).toHaveBeenCalledTimes(1);
  });

  // findDesign - success
  it("should return a design by ID", async () => {
    (designRepo.getDesignById as jest.Mock).mockResolvedValue(mockDesign);

    const result = await designService.findDesign(1);

    expect(result).toEqual(mockDesign);
    expect(designRepo.getDesignById).toHaveBeenCalledWith(1);
  });

  // findDesign - not found
  it("should throw an error if design not found", async () => {
    (designRepo.getDesignById as jest.Mock).mockResolvedValue(null);

    await expect(designService.findDesign(999)).rejects.toThrow("Design not found");
    expect(designRepo.getDesignById).toHaveBeenCalledWith(999);
  });

  // addDesign - success
  it("should call createDesign with correct arguments", async () => {
    (designRepo.createDesign as jest.Mock).mockResolvedValue(undefined);

    await designService.addDesign(
      "Chocolate Delight",
      "Rich chocolate cake",
      "Chocolate",
      1,
      "Medium",
      "chocolate.jpg",
      "Birthday"
    );

    expect(designRepo.createDesign).toHaveBeenCalledWith(
      "Chocolate Delight",
      "Rich chocolate cake",
      "Chocolate",
      1,
      "Medium",
      "chocolate.jpg",
      "Birthday"
    );
  });

  // addDesign - missing required fields
  it("should throw an error if required fields are missing", async () => {
    await expect(
      designService.addDesign("", "desc", "", 1, "", "img.jpg", "category")
    ).rejects.toThrow("Design name, base flavor, and size are required");
    expect(designRepo.createDesign).not.toHaveBeenCalled();
  });

  // modifyDesign - success
  it("should update an existing design", async () => {
    (designRepo.getDesignById as jest.Mock).mockResolvedValue(mockDesign);
    (designRepo.updateDesign as jest.Mock).mockResolvedValue(undefined);

    await designService.modifyDesign(
      1,
      "Updated Design",
      "New description",
      "Vanilla",
      1,
      "Large",
      "updated.jpg",
      "Wedding"
    );

    expect(designRepo.getDesignById).toHaveBeenCalledWith(1);
    expect(designRepo.updateDesign).toHaveBeenCalledWith(
      1,
      "Updated Design",
      "New description",
      "Vanilla",
      1,
      "Large",
      "updated.jpg",
      "Wedding"
    );
  });

  // modifyDesign - not found
  it("should throw an error if design to update is not found", async () => {
    (designRepo.getDesignById as jest.Mock).mockResolvedValue(null);

    await expect(
      designService.modifyDesign(99, "x", "y", "z", 1, "s", "i", "c")
    ).rejects.toThrow("Design not found");
    expect(designRepo.updateDesign).not.toHaveBeenCalled();
  });

  // removeDesign - success
  it("should delete an existing design", async () => {
    (designRepo.getDesignById as jest.Mock).mockResolvedValue(mockDesign);
    (designRepo.deleteDesign as jest.Mock).mockResolvedValue(undefined);

    await designService.removeDesign(1);

    expect(designRepo.getDesignById).toHaveBeenCalledWith(1);
    expect(designRepo.deleteDesign).toHaveBeenCalledWith(1);
  });

  // removeDesign - not found
  it("should throw an error if design to delete is not found", async () => {
    (designRepo.getDesignById as jest.Mock).mockResolvedValue(null);

    await expect(designService.removeDesign(1)).rejects.toThrow("Design not found");
    expect(designRepo.deleteDesign).not.toHaveBeenCalled();
  });
});
