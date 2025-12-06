import * as ordersRepository from '../../src/repositories/orders.repository';
import * as ordersService from '../../src/service/orders.service'; 

jest.mock('../../src/repositories/orders.repository');


describe('Orders Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it("Should create a new order", async () => {
    const newOrderData ={
        "Id": 1,
        "userid": 1,
        "DesignId": 2,
        "Size": "Large",
        "Flavor": "Chocolate",
        "Message": "Happy Birthday, Tanui!",
        "Status": "Pending",
        "DeliveryDate": "2025-10-25T00:00:00.000Z",
        "Price": 3000,
        "Notes": "Include gold sprinkles and floral piping.",
        "ExtendedDescription": "Elegant piping with gold trim",
        "SampleImages": "birthday1.jpg,birthday2.jpg",
        "ColorPreferences": "Gold,White",
    };

    (ordersRepository.createOrder as jest.Mock).mockResolvedValue(newOrderData);

    const createdOrder = await ordersService.createNewOrder(newOrderData as any);
    expect(createdOrder).toEqual(newOrderData);
  });

  it("Should fetch all orders", async () => {
    const mockOrders = [{ id: 1, item: 'Item 1' }, { id: 2, item: 'Item 2' }];
    (ordersRepository.getAllOrders as jest.Mock).mockResolvedValue(mockOrders);

    const orders = await ordersService.fetchAllOrders();

    expect(orders).toEqual(mockOrders);
  });


  it("Should fetch order by ID", async () => {
    const mockOrder = {
        "Id": 1,
        "userid": 1,
        "DesignId": 2,
        "Size": "Large",
        "Flavor": "Chocolate",
        "Message": "Happy Birthday, Tanui!",
        "Status": "Pending",
        "DeliveryDate": "2025-10-25T00:00:00.000Z",
        "Price": 3000,
        "Notes": "Include gold sprinkles and floral piping.",
        "ExtendedDescription": "Elegant piping with gold trim",
        "SampleImages": "birthday1.jpg,birthday2.jpg",
        "ColorPreferences": "Gold,White"
     };

    (ordersRepository.getOrderById as jest.Mock).mockResolvedValue(mockOrder);

    const order = await ordersService.fetchOrderById(1);
    expect(order).toEqual(mockOrder);
  });


  


  it("Should change order status", async () => {
    const mockOrder = { id: 1, status: 'Pending' };
    (ordersRepository.getOrderById as jest.Mock).mockResolvedValue(mockOrder);
    (ordersRepository.updateOrderStatus as jest.Mock).mockResolvedValue({ ...mockOrder, status: 'Completed' });

    const updatedOrder = await ordersService.changeOrderStatus(1, 'Completed');
    expect(updatedOrder).toEqual({ ...mockOrder, status: 'Completed' });

  });

  it("Should throw error when changing status of non-existent order", async () => {

    (ordersRepository.getOrderById as jest.Mock).mockResolvedValue(null);
    await expect(ordersService.changeOrderStatus(1, 'Completed'))
    .rejects
    .toThrow('Order not found');
  });

  it("Should remove an order", async () => {

       const mockOrder = {
        "Id": 1,
        "userid": 1,
        "DesignId": 2,
        "Size": "Large",
        "Flavor": "Chocolate",
        "Message": "Happy Birthday, Tanui!",
        "Status": "Pending",
        "DeliveryDate": "2025-10-25T00:00:00.000Z",
        "Price": 3000,
        "Notes": "Include gold sprinkles and floral piping.",
        "ExtendedDescription": "Elegant piping with gold trim",
        "SampleImages": "birthday1.jpg,birthday2.jpg",
        "ColorPreferences": "Gold,White",
    };

    (ordersRepository.getOrderById as jest.Mock).mockResolvedValue(mockOrder);
    (ordersRepository.deleteOrder as jest.Mock).mockResolvedValue({"message": "Order deleted successfully"});

    const result = await ordersService.removeOrder(1);
    expect(result).toEqual({ "message": "Order deleted successfully"});

  });

  it("Should throw error when removing non-existent order", async () => {

    (ordersRepository.getOrderById as jest.Mock).mockResolvedValue(null);
    await expect(ordersService.removeOrder(1))
    .rejects
    .toThrow('Order not found');
  });

  it("Should get orders by user ID", async () => {
        const mockOrders = [{
        "Id": 1,
        "userid": 1,
        "DesignId": 2,
        "Size": "Large",
        "Flavor": "Chocolate",
        "Message": "Happy Birthday, Tanui!",
        "Status": "Pending",
        "DeliveryDate": "2025-10-25T00:00:00.000Z",
        "Price": 3000,
        "Notes": "Include gold sprinkles and floral piping.",
        "ExtendedDescription": "Elegant piping with gold trim",
        "SampleImages": "birthday1.jpg,birthday2.jpg",
        "ColorPreferences": "Gold,White",
    },{
        "Id": 2,
        "userid": 1,
        "DesignId": 3,
        "Size": "Medium",
        "Flavor": "Vanilla",
        "Message": "Congratulations, Alex!",
        "Status": "Pending",
        "DeliveryDate": "2025-11-15T00:00:00.000Z",
        "Price": 2500,
        "Notes": "Add colorful sprinkles on top.",
        "ExtendedDescription": "Simple design with sprinkles",
        "SampleImages": "congrats1.jpg,congrats2.jpg",
        "ColorPreferences": "Blue,Yellow"
    }];

    (ordersRepository.getOrdersByuserid as jest.Mock).mockResolvedValue(mockOrders);

    const orders = await ordersService.getOrdersByuserid
 (1);
    expect(orders).toEqual(mockOrders);

});

}
)

