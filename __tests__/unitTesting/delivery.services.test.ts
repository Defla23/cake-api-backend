import * as DeliveryServices from "../../src/service/delivery.service";
import * as DeliveryRepository from "../../src/repositories/deliveries.repository";
import { Delivery } from "../../src/types/delivery.types";

jest.mock("../../src/repositories/deliveries.repository");

describe("DeliveryService", () => {
  const mockDelivery: Delivery = {   
    DeliveryID: 1, 
    OrderId: 101,
    DeliveryAddress: "Karatina, Nyeri, Kenya",
    DeliveryDate: "2025-10-30 10:00:00",
    CourierName: "SwiftRider",
    CourierContact: "+254712345678",
    Status: "Scheduled",
    CreatedAt: "2025-10-20 08:00:00",
    UpdatedAt: "2025-10-20 08:00:00",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all deliveries", async () => {
    (DeliveryRepository.getAllDeliveries as jest.Mock).mockResolvedValue([mockDelivery]);

    const result = await DeliveryServices.getAllDelivereries();

    expect(DeliveryRepository.getAllDeliveries).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockDelivery]);
  });

  it("should return a delivery by ID", async () => {
    (DeliveryRepository.getDeliveryById as jest.Mock).mockResolvedValue(mockDelivery);

    const result = await DeliveryServices.getDeliveryById(1);
    expect(DeliveryRepository.getDeliveryById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockDelivery);
  });

  it("should create a new delivery", async () => {
    (DeliveryRepository.createDelivery as jest.Mock).mockResolvedValue(undefined);

    const newDelivery: Delivery = {
      OrderId: 105,
      DeliveryAddress: "Eldoret, Kenya",
      DeliveryDate: "2025-11-01 11:00:00",
      CourierName: "QuickShip",
      CourierContact: "+254701112233",
      Status: "Scheduled",
    };

    await DeliveryServices.scheduleDelivery(newDelivery);

    expect(DeliveryRepository.createDelivery).toHaveBeenCalledWith(newDelivery);
  });

  it("should update an existing delivery", async () => {
    (DeliveryRepository.updateDelivery as jest.Mock).mockResolvedValue(undefined);

    const updatedData: Delivery = {
      OrderId: 101,
      DeliveryAddress: "Karatina, Nyeri, Kenya",
      DeliveryDate: "2025-10-31 09:00:00",
      CourierName: "SwiftRider",
      CourierContact: "+254712345678",
      Status: "In Transit",
    };

   
    const existingDelivery = await DeliveryServices.getDeliveryById(1);
    const updatedDataMerged = { ...existingDelivery, ...updatedData };

    await DeliveryServices.updateDelivery(1, updatedDataMerged);

    expect(DeliveryRepository.updateDelivery).toHaveBeenCalledWith(1, updatedDataMerged);
  });

  it("should delete a delivery", async () => {
    (DeliveryRepository.deleteDelivery as jest.Mock).mockResolvedValue(undefined);

    await DeliveryServices.deleteDelivery(1);

    expect(DeliveryRepository.deleteDelivery).toHaveBeenCalledWith(1);
  });
});
