import { getPool } from "../db/config";
import sql from "mssql";

//  Create new design
export const createDesign = async (
  designName: string,
  description: string,
  baseFlavor: string,
  availability: number,
  size: string,
  imageUrl: string,
  category: string,
) => {
  const pool = await getPool();
  await pool
    .request()
    .input("DesignName", sql.NVarChar, designName)
    .input("Description", sql.NVarChar, description)
    .input("BaseFlavor", sql.NVarChar, baseFlavor)
    .input("Availability", sql.Bit, availability)
    .input("Size", sql.NVarChar, size)
    .input("ImageUrl", sql.NVarChar, imageUrl)
    .input("Category", sql.NVarChar, category).query(`
      INSERT INTO Cake_Designs 
        (DesignName, Description, BaseFlavor, Size, ImageUrl, Category, Availability, CreatedAt, UpdatedAt)
      VALUES 
        (@DesignName, @Description, @BaseFlavor, @Size, @ImageUrl, @Category, @Availability, SYSDATETIME(), SYSDATETIME())
    `);
};

// Fetch all designs
export const getAllDesigns = async () => {
  const pool = await getPool();
  const result = await pool
    .request()
    .query("SELECT * FROM Cake_Designs ORDER BY CreatedAt ASC");
  return result.recordset;
};

//  Fetch design by ID
export const getDesignById = async (id: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("Id", sql.Int, id)
    .query("SELECT * FROM Cake_Designs WHERE DesignID = @Id");
  return result.recordset[0];
};

export const updateDesign = async (
  id: number,
  designName: string,
  description: string,
  baseFlavor: string,
  availability: number,
  size: string,
  imageUrl: string,
  category: string,
) => {
  const pool = await getPool();
  await pool
    .request()
    .input("Id", sql.Int, id)
    .input("DesignName", sql.NVarChar, designName)
    .input("Description", sql.NVarChar, description)
    .input("BaseFlavor", sql.NVarChar, baseFlavor)
    .input("Availability", sql.Bit, availability)
    .input("Size", sql.NVarChar, size)
    .input("ImageUrl", sql.NVarChar, imageUrl)
    .input("Category", sql.NVarChar, category).query(`
      UPDATE Cake_Designs
      SET 
        DesignName = @DesignName, 
        Description = @Description,
        BaseFlavor = @BaseFlavor,
        Availability = @Availability,
        Size = @Size,
        ImageUrl = @ImageUrl,
        Category = @Category,
        UpdatedAt = SYSDATETIME()
      WHERE DesignID = @Id
    `);
};

//  Delete design
export const deleteDesign = async (id: number) => {
  const pool = await getPool();
  await pool
    .request()
    .input("Id", sql.Int, id)
    .query("DELETE FROM Cake_Designs WHERE DesignID = @Id");
};
