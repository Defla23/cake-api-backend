export interface Cake {
  cakeId?: number;
  cakeName: string;
  flavorsUsed: string;
  size: "Small" | "Medium" | "Large";
  imageURL?: string;
  quantityAvailable?: number;
  isactive?: number;
}
