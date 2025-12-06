export interface NewOrder {
  userid: number;
  DesignID?: number;
  Size: "Small" | "Medium" | "Large";
  Flavor: string;
  Message?: string;
  Status?: "Pending" | "In Progress" | "Completed";
  DeliveryDate: Date;
  Notes?: string;
  ExtendedDescription?: string;
  SampleImages?: string[];
  ColorPreferences?: string[];
}
export interface updateOrder {
  userid?: number;
  DesignID?: number;
  Size?: "Small" | "Medium" | "Large";
  Flavor?: string;
  Message?: string;
  Status?: "Pending" | "In Progress" | "Completed";
  DeliveryDate?: Date;
  Notes?: string;
  ExtendedDescription?: string;
  SampleImages?: string[];
  ColorPreferences?: string[];
}
