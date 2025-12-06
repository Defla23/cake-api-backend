import * as cakeRepository from '../../src/repositories/readycakes.repository';
import * as cakeService from '../../src/service/readycakes.service';

jest.mock('../../src/repositories/readycakes.repository');

describe('Cake Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list all cakes', async () => {
    const mockCakes = [
      { id: 1, cakeName: 'Chocolate Delight', flavorsUsed: 'Chocolate', size: 'Medium' },
      { id: 2, cakeName: 'Vanilla Dream', flavorsUsed: 'Vanilla', size: 'Small' }
    ];

    (cakeRepository.getAllCakes as jest.Mock).mockResolvedValue(mockCakes);

    const cakes = await cakeService.listCakes();
    expect(cakes).toEqual(mockCakes);
    expect(cakeRepository.getAllCakes).toHaveBeenCalledTimes(1);
  });

  it('should get a cake by ID', async () => {
    const mockCake = { id: 1, cakeName: 'Chocolate Delight', flavorsUsed: 'Chocolate', size: 'Medium' };

    (cakeRepository.getCakeById as jest.Mock).mockResolvedValue(mockCake);

    const cake = await cakeService.getCake(1);
    expect(cake).toEqual(mockCake);
    expect(cakeRepository.getCakeById).toHaveBeenCalledWith(1);
  });

  it('should throw error for invalid cake ID', async () => {
    await expect(cakeService.getCake(NaN)).rejects.toThrow('Invalid cake ID');
  });

  it('should throw error if cake not found', async () => {
    (cakeRepository.getCakeById as jest.Mock).mockResolvedValue(null);
    await expect(cakeService.getCake(99)).rejects.toThrow('Cake not found');
  });

  it('should create a new cake', async () => {
    const newCakeData = {
      cakeName: 'Strawberry Bliss',
      flavorsUsed: 'Strawberry, Cream',
      size: 'Large',
      basePrice: 2500,
    };

    (cakeRepository.createCake as jest.Mock).mockResolvedValue({
      id: 1,
      ...newCakeData,
    });

    const result = await cakeService.createCake(newCakeData as any);
    expect(result).toEqual({ id: 1, ...newCakeData });
    expect(cakeRepository.createCake).toHaveBeenCalledWith(newCakeData);
  });

  it('should throw error when required fields are missing', async () => {
    const invalidCakeData = { cakeName: '', flavorsUsed: '', size: '' };
    await expect(cakeService.createCake(invalidCakeData as any))
      .rejects
      .toThrow('cakeName, flavorsUsed, and size are required');
  });

  it('should update an existing cake', async () => {
    const mockCake = { id: 1, cakeName: 'Chocolate Delight', flavorsUsed: 'Chocolate', size: 'Medium' };

    (cakeRepository.getCakeById as jest.Mock).mockResolvedValue(mockCake);
    (cakeRepository.updateCake as jest.Mock).mockResolvedValue(undefined);

    const result = await cakeService.updateCake(1, { size: 'Large' });
    expect(result).toEqual({ message: 'Cake updated successfully' });
    expect(cakeRepository.updateCake).toHaveBeenCalledWith(1, { size: 'Large' });
  });

  it('should throw error when updating non-existent cake', async () => {
    (cakeRepository.getCakeById as jest.Mock).mockResolvedValue(null);
    await expect(cakeService.updateCake(99, { size: 'Large' }))
      .rejects
      .toThrow('Cake not found');
  });

  it('should delete a cake successfully', async () => {
    const mockCake = { id: 1, cakeName: 'Chocolate Delight', flavorsUsed: 'Chocolate', size: 'Medium' };

    (cakeRepository.getCakeById as jest.Mock).mockResolvedValue(mockCake);
    (cakeRepository.deleteCake as jest.Mock).mockResolvedValue(undefined);

    const result = await cakeService.deleteCake(1);
    expect(result).toEqual({ message: 'Cake deleted successfully' });
    expect(cakeRepository.deleteCake).toHaveBeenCalledWith(1);
  });

  it('should throw error when deleting non-existent cake', async () => {
    (cakeRepository.getCakeById as jest.Mock).mockResolvedValue(null);
    await expect(cakeService.deleteCake(1)).rejects.toThrow('Cake not found');
  });
});
